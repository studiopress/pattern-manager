<?php
/**
 * Class UtilsTest
 *
 * @package pattern-manager
 */

namespace PatternManager\PatternPostType;

use PHPUnit\Framework\TestCase;

require_once dirname( __DIR__ ) . '/utils.php';

/**
 * Test the util functions.
 */
class UtilsTest extends TestCase {

	public function data_get_new_pattern_number() {
		return array(
			array( 'my-new-pattern', array(), 0 ),
			array( 'my-new-pattern', array( 'different-name' => array() ), 0 ),
			array( 'my-new-pattern', array( 'my-new-pattern' => array() ), 1 ),
			array( 'my-new-pattern', array( 'my-new-pattern-0' => array() ), 0 ),
			array(
				'my-new-pattern',
				array(
					'my-new-pattern'   => array(),
					'my-new-pattern-5' => array(),
				),
				1,
			),
			array(
				'my-new-pattern',
				array(
					'my-new-pattern'   => array(),
					'my-new-pattern-1' => array(),
				),
				2,
			),
			array(
				'my-new-pattern',
				array(
					'my-new-pattern'   => array(),
					'my-new-pattern-4' => array(),
					'my-new-pattern-5' => array(),
					'my-new-pattern-6' => array(),
				),
				1,
			),
			array(
				'my-new-pattern',
				array(
					'my-new-pattern'   => array(),
					'my-new-pattern-1' => array(),
					'my-new-pattern-2' => array(),
					'my-new-pattern-3' => array(),
				),
				4,
			),
		);
	}

	/**
	 * Gets the dir path.
	 *
	 * @dataProvider data_get_new_pattern_number
	 */
	public function test_get_new_pattern_number( $pattern_name, $patterns, $expected ) {
		$this->assertSame(
			$expected,
			get_new_pattern_number( $pattern_name, $patterns )
		);
	}
}
