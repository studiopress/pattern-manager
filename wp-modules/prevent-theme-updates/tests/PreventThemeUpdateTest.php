<?php
/**
 * Class PatternManagerPreventThemeUpdateTest
 *
 * @package pattern-manager
 */

/**
 * Test this module's functions.
 */
class PatternManagerPreventThemeUpdateTest extends WP_UnitTestCase {

	/**
	 * Test that when themes do not have PM mods, their updates are not prevented.
	 */
	public function testDoNotBlockThemesWithNoPmMods() {
		$value               = new stdClass();
		$value->last_checked = 1678397389;
		$value->checked      = array(
			'twentytwentythree' => 1.1,
			'twentytwentytwo'   => 1.4,
		);
		$value->response     = array(
			'twentytwentythree' => array(
				'theme'        => 'twentytwentythree',
				'new_version'  => 1.0,
				'url'          => 'https://wordpress.org/themes/twentytwentythree/',
				'package'      => 'https://downloads.wordpress.org/theme/twentytwentythree.1.0.zip',
				'requires'     => 6.1,
				'requires_php' => 5.6,
			),
		);
		$value->no_update    = array(
			'twentytwentytwo' => array(
				'theme'        => 'twentytwentytwo',
				'new_version'  => 1.3,
				'url'          => 'https://wordpress.org/themes/twentytwentytwo/',
				'package'      => 'https://downloads.wordpress.org/theme/twentytwentytwo.1.3.zip',
				'requires'     => 5.9,
				'requires_php' => 5.6,
			),
		);
		$value->translations = array();

		$expected = $value;

		$result = \PatternManager\PreventThemeUpdates\block_theme_updates_if_modified_by_pm( $value, 'update_themes' );

		$this->assertEquals( $expected, $result );
	}


	/**
	 * Test that when themes do have PM mods, their updates are prevented.
	 */
	public function testBlockThemesWithPmMods() {
		update_option( 'pm_mod_twentytwentythree', true );

		$value               = new stdClass();
		$value->last_checked = 1678397389;
		$value->checked      = array(
			'twentytwentythree' => 1.1,
			'twentytwentytwo'   => 1.4,
		);
		$value->response     = array(
			'twentytwentythree' => array(
				'theme'        => 'twentytwentythree',
				'new_version'  => 1.0,
				'url'          => 'https://wordpress.org/themes/twentytwentythree/',
				'package'      => 'https://downloads.wordpress.org/theme/twentytwentythree.1.0.zip',
				'requires'     => 6.1,
				'requires_php' => 5.6,
			),
		);
		$value->no_update    = array(
			'twentytwentytwo' => array(
				'theme'        => 'twentytwentytwo',
				'new_version'  => 1.3,
				'url'          => 'https://wordpress.org/themes/twentytwentytwo/',
				'package'      => 'https://downloads.wordpress.org/theme/twentytwentytwo.1.3.zip',
				'requires'     => 5.9,
				'requires_php' => 5.6,
			),
		);
		$value->translations = array();

		$expected           = $value;
		$expected->response = array();

		$result = \PatternManager\PreventThemeUpdates\block_theme_updates_if_modified_by_pm( $value, 'update_themes' );

		$this->assertEquals( $expected, $result );
	}

}
