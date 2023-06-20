<?php
/**
 * Plugin Name: Pattern Manager
 * Description: Create and maintain patterns.
 * Version: 0.3.0
 * Author: WP Engine
 * Author URI: wpengine.com
 * Text Domain: pattern-manager
 * Domain Path: languages
 * License: GPLv2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Requires at least: 6.1
 * Requires PHP: 7.4
 * Namespace: PatternManager
 *
 * @package pattern-manager
 */

namespace PatternManager;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Automatically include wp modules, which are in the "wp-modules" directory.
 *
 * @return void
 */
function include_custom_modules() {
	$wp_modules = glob( plugin_dir_path( __FILE__ ) . 'wp-modules*/*' );

	foreach ( $wp_modules as $wp_module ) {
		$module_name = basename( $wp_module );
		$filename    = $module_name . '.php';
		$filepath    = $wp_module . '/' . $filename;

		if ( is_readable( $filepath ) ) {
			// If the module data exists, load it.
			require $filepath;
		}
	}
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\include_custom_modules' );
