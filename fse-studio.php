<?php
/**
 * Plugin Name: FSE Studio
 * Plugin URI: wpengine.com
 * Description: An app for creating an maintaining FSE Themes.
 * Version: 0.0.0
 * Author: WP Engine
 * Author URI: wpengine.com
 * Text Domain: fse-studio
 * Domain Path: languages
 * License: GPLv2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Network: 
 * Update URI: 
 * Namespace: FseStudio
 *
 * @package fse-studio
 */

namespace FseStudio;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Automatically include wp modules, which sit in the "wp-modules" directory.
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
		} else {
			// Translators: The name of the module, and the filename that needs to exist inside that module.
			echo esc_html( sprintf( __( 'The module called "%1$s" has a problem. It needs a file called "%2$s" to exist in its root directory.', 'wpps' ), $module_name, $filename ) );
			exit;
		}
	}
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\include_custom_modules' );
