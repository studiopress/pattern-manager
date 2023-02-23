<?php
/**
 * Class PatternDataHandlersTest
 *
 * @package pattern-manager
 */

namespace PatternManager\PatternDataHandlers;

use stdClass;
use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/pattern-data-handlers.php';

/**
 * Test the pattern functions.
 */
class PatternDataHandlersTest extends WP_UnitTestCase {

	/**
	 * Normalizes in order to compare in tests.
	 */
	public function normalize( string $to_normalize ): string {
		return preg_replace( '/[\t\n]/', '', $to_normalize );
	}

	/**
	 * Tests get_pattern_by_path.
	 */
	public function test_get_pattern_by_path() {
		$actual_pattern = get_pattern_by_path( __DIR__ . '/fixtures/my-new-pattern.php' );
		$this->assertSame(
			[
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
			],
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
		add_filter( 'request_filesystem_credentials', '__return_true' );
		$pattern_path = __DIR__ . '/fixtures/my-new-pattern.php';

		$this->assertSame(
			file_get_contents( $pattern_path ),
			construct_pattern_php_file_contents(
				get_pattern_by_path( $pattern_path ),
				'foo-textdomain'
			)
		);
	}
}
