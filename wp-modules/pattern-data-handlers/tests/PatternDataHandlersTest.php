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
	 * Tests add_active_theme_to_heartbeat.
	 */
	public function test_update_pattern_empty() {
		update_pattern( [ 'name' => 'foo' ] );

		$this->assertSame(
			[ 'name' => 'foo' ],
			get_pattern_by_name( 'foo' )
		);
	}
}
