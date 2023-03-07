<?php
/**
 * Class PatternDataHandlersTest
 *
 * @package pattern-manager
 */

// phpcs:disable WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

namespace PatternManager\PatternDataHandlers;

require_once dirname( __DIR__ ) . '/pattern-data-handlers.php';

use WP_UnitTestCase;
use function WP_Filesystem;

/**
 * Test the pattern functions.
 */
class PatternDataHandlersTest extends WP_UnitTestCase {

	/**
	 * @inheritDoc
	 */
	public function set_up() {
		parent::set_up();
		add_filter( 'request_filesystem_credentials', '__return_true' );
		add_filter( 'filesystem_method_file', array( $this, 'filter_abstraction_file' ) );
		add_filter( 'filesystem_method', array( $this, 'filter_fs_method' ) );
		add_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
		WP_Filesystem();
	}

	/**
	 * @inheritDoc
	 */
	public function tear_down() {
		global $wp_filesystem;
		remove_filter( 'request_filesystem_credentials', '__return_true' );
		remove_filter( 'filesystem_method_file', array( $this, 'filter_abstraction_file' ) );
		remove_filter( 'filesystem_method', array( $this, 'filter_fs_method' ) );
		remove_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
		unset( $wp_filesystem );

		parent::tear_down();
	}

	/**
	 * Filters the FS method.
	 */
	public function filter_fs_method( $method ) {
		return 'MockFS';
	}

	/**
	 * Filters the abstraction file.
	 */
	public function filter_abstraction_file( $file ) {
		return WP_TESTS_DIR . '/includes/mock-fs.php';
	}

	/**
	 * Gets the fixtures directory.
	 */
	public function get_fixtures_directory() {
		global $wp_filesystem;
		return $wp_filesystem->abspath();
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
	 * Tests get_theme_patterns.
	 */
	public function test_get_theme_patterns() {
		$patterns = get_theme_patterns();

		$this->assertCount( 1, array_values( $patterns ) );
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

		$this->assertCount( 1, array_values( $patterns ) );
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
			[ 'my-new-pattern' ],
			get_pattern_names()
		);
	}

	/**
	 * Test tree_shake_theme_images.
	 */
	public function test_tree_shake_theme_images() {
		global $wp_filesystem;

		$wp_filesystem->init();
		tree_shake_theme_images( $wp_filesystem );

		// Tree shaking shouldn't remove this, as it's in a pattern.
		$this->assertTrue(
			$wp_filesystem->exists(
				'patterns/images/WPE-ShareImage-A-1200x630-1.png'
			)
		);

		// Tree shaking should remove this, as it's not in a pattern.
		$this->assertFalse(
			$wp_filesystem->exists(
				'patterns/images/not-used.png'
			)
		);
	}
}
