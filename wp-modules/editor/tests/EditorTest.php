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
	 * Tests register_pattern_post_type.
	 */
	public function test_register_pattern_post_type() {
		register_pattern_post_type();
		$cpt_object = get_post_type_object( 'pm_pattern' );

		$this->assertSame( false, $cpt_object->public );
		$this->assertTrue( $cpt_object->show_in_rest );
		$this->assertTrue( post_type_supports( 'pm_pattern', 'editor' ) );
		$this->assertTrue( post_type_supports( 'pm_pattern', 'custom-fields' ) );
		$this->assertTrue( post_type_supports( 'pm_pattern', 'title' ) );
	}

	/**
	 * Tests register_pattern_post_type.
	 */
	public function test_register_pattern_post_type_meta_types() {
		register_pattern_post_type();
		
		$pattern_default_keys = get_pattern_defaults();
		$registered_keys      = get_registered_meta_keys( 'post', 'pm_pattern' );
		
		// Loop through each default key to make sure its type matches what was actually registered by WP.
		foreach ( $pattern_default_keys as $meta_key => $default_value ) {

			// The title and content pattern defaults are not registered meta keys, so skip them.
			if ( 'title' === $meta_key || 'content' === $meta_key ) {
				continue;
			}

			$expected_type = $registered_keys[ $meta_key ]['type'];
			
			// Fix the typing for numbers.
			if ( 'number' === $expected_type ) {
				$expected_type = 'integer';
			}

			$actual_type = gettype( $default_value );
			
			$this->assertSame(
				$expected_type,
				$actual_type,
				"The type of the default for {$meta_key} is wrong. It should be {$expected_type} but it was {$actual_type}"
			);
		}
	}

	/**
	 * Tests register_pattern_post_type.
	 */
	public function test_register_pattern_post_type_meta_defaults() {
		register_pattern_post_type();

		$pattern_default_keys = get_pattern_defaults();
		$registered_keys      = get_registered_meta_keys( 'post', 'pm_pattern' );

		// Loop through each default key to make sure its default value matches what was actually registered by WP.
		foreach ( $pattern_default_keys as $meta_key => $default_value ) {

			// The title and content pattern defaults are not registered meta keys, so skip them.
			if ( 'title' === $meta_key || 'content' === $meta_key ) {
				continue;
			}

			$actual_value = $registered_keys[ $meta_key ]['default'];

			$this->assertSame(
				$default_value,
				$actual_value,
				"The value of the default for {$meta_key} is wrong."
			);
		}
	}
}
