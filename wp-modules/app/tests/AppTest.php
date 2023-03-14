<?php
/**
 * Class AppTest
 *
 * @package pattern-manager
 */

namespace PatternManager\App;

use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/app.php';

/**
 * Test the app.
 */
class AppTest extends WP_UnitTestCase {

	/**
	 * Tests get_app_state.
	 */
	public function test_get_app_state() {
		$app_state = get_app_state();

		$this->assertTrue( array_key_exists( 'patterns', $app_state ) );
		$this->assertTrue( array_key_exists( 'patternCategories', $app_state ) );
		$this->assertTrue( array_key_exists( 'apiNonce', $app_state ) );
		$this->assertTrue( array_key_exists( 'apiEndpoints', $app_state ) );
		$this->assertTrue( array_key_exists( 'siteUrl', $app_state ) );
		$this->assertTrue( array_key_exists( 'adminUrl', $app_state ) );
	}

	/**
	 * Tests pattern_manager_app.
	 */
	public function test_pattern_manager_app() {
		ob_start();
		pattern_manager_app();
		$result = ob_get_clean():

		$this->assertSame( '<div id="pattern-manager-app"></div>', $result );
		$this->assertTrue( wp_script_is( 'pattern-manager' ) );
		$this->assertTrue( wp_style_is( 'pattern_manager_style' ) );
	}

	/**
	 * Tests pattern_manager_admin_menu_page.
	 */
	public function pattern_manager_admin_menu_page() {
		$this->assertSame(
			'wrong',
			pattern_manager_admin_menu_page()
		);
	}
}
