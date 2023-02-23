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
		$this->assertSame(
			[
				'name'          => 'my-new-pattern',
				'title'         => 'My New Pattern',
				'slug'          => 'my-new-pattern',
				'description'   => 'Here is a description',
				'viewportWidth' => '1280',
				'categories'    => [ 'contact', 'featured' ],
				'keywords'      => [ 'example', 'music' ],
				'blockTypes'    => [ 'core/gallery', 'core/media-text' ],
				'postTypes'     => [ 'wp_block', 'wp_template' ],
				'inserter'      => true,
				'content'       => '<!-- wp:paragraph -->
				<p>Here is some content</p>
				<!-- /wp:paragraph -->',
			],
			get_pattern_by_path( __DIR__ . '/fixtures/my-new-pattern.php' )
		);
	}

	/**
	 * Tests construct_pattern_php_file_contents.
	 */
	public function test_construct_pattern_php_file_contents() {
		$pattern_path = __DIR__ . '/fixtures/my-new-pattern.php';

		ob_start();
		require $pattern_path;
		$pattern_contents = ob_get_clean();

		$this->assertSame(
			$pattern_contents,
			construct_pattern_php_file_contents(
				get_pattern_by_path( $pattern_path ),
				'foo-textdomain'
			)
		);
	}
}
