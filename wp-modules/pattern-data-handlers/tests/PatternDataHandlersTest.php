<?php
/**
 * Class PatternDataHandlersTest
 *
 * @package pattern-manager
 */

namespace PatternManager\PatternDataHandlers;

use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/pattern-data-handlers.php';

/**
 * Test the pattern functions.
 */
class PatternDataHandlersTest extends WP_UnitTestCase {

	/**
	 * @inheritDoc
	 */
	public function setUp() : void {
		parent::setUp();
		add_filter( 'request_filesystem_credentials', '__return_true' );
		add_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
		add_filter( 'stylesheet_directory_uri', [ $this, 'get_stylesheet_directory_uri' ] );
	}

	/**
	 * @inheritDoc
	 */
	public function tearDown() : void {
		remove_filter( 'request_filesystem_credentials', '__return_true' );
		remove_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
		remove_filter( 'stylesheet_directory_uri', [ $this, 'get_stylesheet_directory_uri' ] );
		parent::tearDown();
	}

	/**
	 * Gets the fixtures directory.
	 */
	public function get_fixtures_directory() {
		return __DIR__ . '/fixtures';
	}

	/**
	 * Gets the stylesheet directory URI.
	 */
	public function get_stylesheet_directory_uri() {
		return 'https://example.com/wp-content/themes/foo';
	}

	/**
	 * Normalizes in order to compare in tests.
	 */
	public function normalize( string $to_normalize ): string {
		return preg_replace(
			'/\s?[\t\n]/',
			'',
			preg_replace( '/\/\/ phpcs:disable.*[\t\n]/', '', $to_normalize )
		);
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
	 * Tests construct_pattern_php_file_contents.
	 */
	public function test_construct_pattern_php_file_contents_empty() {
		$this->assertSame(
			$this->normalize(
				// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
				file_get_contents( $this->get_fixtures_directory() . '/expected/empty.php' )
			),
			$this->normalize(
				construct_pattern_php_file_contents(
					[
						'name'  => 'empty',
						'slug'  => 'empty',
						'title' => 'Empty',
					]
				)
			)
		);
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
	 * Tests get_pattern_by_name.
	 */
	public function test_get_pattern_by_name_not_found() {
		$this->assertFalse(
			get_pattern_by_name( 'does-not-exist' )
		);
	}

	/**
	 * Tests get_pattern_by_name.
	 */
	public function test_get_pattern_by_name() {
		$actual_pattern = get_pattern_by_name( 'my-new-pattern' );

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
	public function test_construct_pattern_php_file_contents_with_values() {
		$pattern_path = $this->get_fixtures_directory() . '/patterns/my-new-pattern.php';

		$this->assertSame(
			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
			file_get_contents( $pattern_path ),
			construct_pattern_php_file_contents(
				get_pattern_by_path( $pattern_path )
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
		tree_shake_theme_images();

		// Tree shaking should only keep the used image.
		$this->assertSame(
			[
				$this->get_fixtures_directory() . '/patterns/images/used.jpg',
			],
			glob(
				$this->get_fixtures_directory() . '/patterns/images/*.jpg',
			)
		);
	}
}
