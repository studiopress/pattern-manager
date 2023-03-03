<?php
/**
 * Class EditorTest
 *
 * @package pattern-manager
 */

namespace PatternManager\Editor;

use WP_UnitTestCase;
use function PatternManager\PatternDataHandlers\get_pattern_defaults;

require_once dirname( dirname( __DIR__ ) ) . '/pattern-data-handlers/pattern-data-handlers.php';
require_once dirname( __DIR__ ) . '/editor.php';

/**
 * Test the editor.
 */
class EditorTest extends WP_UnitTestCase {

	/**
	 * Tests register_pattern_post_type_meta.
	 */
	public function test_register_pattern_post_type_meta_types() {
		register_pattern_post_type();

		foreach ( array_diff( get_pattern_defaults(), [ 'title' => null ] ) as $meta_key => $default_value ) {
			$expected_type = get_registered_meta_keys( 'post', 'pm_pattern' )[ $meta_key ]['type'];
			$this->assertSame(
				'number' === $expected_type ? 'integer' : $expected_type,
				gettype( $default_value )
			);
		}
	}

	/**
	 * Tests register_pattern_post_type_meta.
	 */
	public function test_register_pattern_post_type_meta_defaults() {
		register_pattern_post_type();

		foreach ( array_diff( get_pattern_defaults(), [ 'title' => null ] ) as $meta_key => $default_value ) {
			$this->assertSame(
				$default_value,
				get_registered_meta_keys( 'post', 'pm_pattern' )[ $meta_key ]['default']
			);
		}
	}
}
