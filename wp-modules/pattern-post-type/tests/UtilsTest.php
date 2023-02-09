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

	/**
	 * Gets the data for the test of get_new_pattern_number().
	 *
	 * @return array[]
	 */
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
	 * Tests get_new_pattern_number.
	 *
	 * @dataProvider data_get_new_pattern_number
	 */
	public function test_get_new_pattern_number( $pattern_name, $patterns, $expected ) {
		$this->assertSame(
			$expected,
			get_new_pattern_number( $pattern_name, $patterns )
		);
	}

	/**
	 * Gets the data for the test of get_duplicate_pattern_ids().
	 *
	 * @return array[]
	 */
	public function data_get_duplicate_pattern_ids() {
		return array(
			array( 'my-new-pattern', array(), array() ),
			array(
				'my-new-pattern',
				array(
					'my-new-pattern' => array(
						'name'  => 'my-new-pattern',
						'slug'  => 'my-new-pattern',
						'title' => 'My New Pattern',
					),
				),
				array(
					'name'  => 'my-new-pattern-copied',
					'slug'  => 'my-new-pattern-copied',
					'title' => 'My New Pattern (copied)',
				),
			),
			array(
				'my-new-pattern',
				array(
					'my-new-pattern'        => array(
						'name'  => 'my-new-pattern',
						'slug'  => 'my-new-pattern',
						'title' => 'My New Pattern',
					),
					'my-new-pattern-copied' => array(
						'name'  => 'my-new-pattern-copied',
						'slug'  => 'my-new-pattern-copied',
						'title' => 'My New Pattern (copied)',
					),
				),
				array(
					'name'  => 'my-new-pattern-copied-1',
					'slug'  => 'my-new-pattern-copied-1',
					'title' => 'My New Pattern (copied) 1',
				),
			),
			array(
				'my-new-pattern',
				array(
					'my-new-pattern'          => array(
						'name'  => 'my-new-pattern',
						'slug'  => 'my-new-pattern',
						'title' => 'My New Pattern',
					),
					'my-new-pattern-copied'   => array(
						'name'  => 'my-new-pattern-copied',
						'slug'  => 'my-new-pattern-copied',
						'title' => 'My New Pattern (copied)',
					),
					'my-new-pattern-copied-1' => array(
						'name'  => 'my-new-pattern-copied-1',
						'slug'  => 'my-new-pattern-copied-1',
						'title' => 'My New Pattern (copied) 1',
					),
				),
				array(
					'name'  => 'my-new-pattern-copied-2',
					'slug'  => 'my-new-pattern-copied-2',
					'title' => 'My New Pattern (copied) 2',
				),
			),
		);
	}

	/**
	 * Tests get_duplicate_pattern.
	 *
	 * @dataProvider data_get_duplicate_pattern_ids
	 */
	public function test_get_duplicate_pattern_ids( $pattern_name, $patterns, $expected ) {
		$this->assertSame(
			$expected,
			get_duplicate_pattern_ids( $pattern_name, $patterns )
		);
	}
}
