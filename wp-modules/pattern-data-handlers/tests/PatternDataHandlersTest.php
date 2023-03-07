<?php
/**
 * Class PatternDataHandlersTest
 *
 * @package pattern-manager
 */

// phpcs:disable WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

namespace PatternManager\PatternDataHandlers;

use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/pattern-data-handlers.php';
require_once __DIR__ . '/fixtures/WpFilesystemSpy.php';

/**
 * Test the pattern functions.
 */
class PatternDataHandlersTest extends WP_UnitTestCase {

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		global $wp_filesystem;

		parent::setUp();
		add_filter( 'request_filesystem_credentials', '__return_true' );
		add_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );

		$this->wp_filesystem = new WpFilesystemSpy();

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$wp_filesystem = $this->wp_filesystem;
	}

	/**
	 * @inheritDoc
	 */
	public function tearDown() {
		remove_filter( 'request_filesystem_credentials', '__return_true' );
		remove_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
		unset( $GLOBALS['wp_filesystem'] );
		parent::tearDown();
	}

	/**
	 * Gets the fixtures directory.
	 */
	public function get_fixtures_directory() {
		return __DIR__ . '/fixtures';
	}

	/**
	 * Normalizes in order to compare in tests.
	 */
	public function normalize( string $to_normalize ): string {
		return preg_replace( '/[\t\n]/', '', $to_normalize );
	}

	/**
	 * Gets the expected pattern.
	 */
	public function get_expected_pattern() {
		return [
			'title'         => 'My New Pattern',
			'slug'          => 'my-new-pattern',
			'description'   => 'Here is a description',
			'viewportWidth' => 1280,
			'categories'    => [ 'contact', 'featured' ],
			'keywords'      => [ 'example', 'music' ],
			'blockTypes'    => [ 'core/gallery', 'core/media-text' ],
			'postTypes'     => [ 'wp_block', 'wp_template' ],
			'inserter'      => true,
			'content'       => '<!-- wp:paragraph --><p>Here is some content</p><!-- /wp:paragraph -->',
			'name'          => 'my-new-pattern',
		];
	}

	/**
	 * Tests get_pattern_by_path.
	 */
	public function test_get_pattern_by_path() {
		$actual_pattern = get_pattern_by_path( $this->get_fixtures_directory() . '/patterns/my-new-pattern.php' );

		$this->assertSame(
			$this->get_expected_pattern(),
			array_merge(
				$actual_pattern,
				[
					'content' => $this->normalize( $actual_pattern['content'] ),
				]
			)
		);
	}

	/**
	 * Tests construct_pattern_php_file_contents.
	 */
	public function test_construct_pattern_php_file_contents() {
		$pattern_path = $this->get_fixtures_directory() . '/patterns/my-new-pattern.php';

		$this->assertSame(
			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
			file_get_contents( $pattern_path ),
			construct_pattern_php_file_contents(
				get_pattern_by_path( $pattern_path ),
				'foo-textdomain'
			)
		);
	}

	/**
	 * Tests get_theme_patterns.
	 */
	public function test_get_theme_patterns() {
		$patterns = get_theme_patterns();

		$this->assertCount( 2, array_values( $patterns ) );
		$this->assertSame(
			[
				'my-new-pattern' => $this->get_expected_pattern(),
			],
			[
				'my-new-pattern' => array_merge(
					$patterns['my-new-pattern'],
					[
						'content' => $this->normalize( $patterns['my-new-pattern']['content'] ),
					]
				),
			]
		);
	}

	/**
	 * Tests get_theme_patterns_with_editor_links.
	 */
	public function test_get_theme_patterns_with_editor_links() {
		$patterns = get_theme_patterns_with_editor_links();

		$this->assertCount( 2, array_values( $patterns ) );
		$this->assertTrue(
			array_key_exists(
				'editorLink',
				$patterns['my-new-pattern']
			)
		);
	}

	/**
	 * Test get_pattern_names.
	 */
	public function test_get_pattern_names() {
		$this->assertSame(
			[
				'my-new-pattern',
				'with-image',
			],
			get_pattern_names()
		);
	}

	/**
	 * Test tree_shake_theme_images.
	 */
	public function test_tree_shake_theme_images() {
		tree_shake_theme_images( $this->wp_filesystem );

		// Tree shaking should only keep (copy) the used image.
		$this->assertSame(
			[
				$this->get_fixtures_directory() . '/temp-images/',
				$this->get_fixtures_directory() . '/patterns/images/used.jpg',
			],
			$this->wp_filesystem->get_copied()
		);
	}
}
