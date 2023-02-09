<?php
/**
 * Class UtilsTest
 *
 * @package pattern-manager
 */

namespace PatternManager\PatternPostType;

/**
 * Test this module's functions.
 */
class UtilsTest extends WP_UnitTestCase {

	/**
	 * Gets the dir path.
	 */
	public function test_get_new_pattern_number() {
		$this->assertSame(
			0,
			get_new_pattern_number( '', [] )
		);
	}
}
