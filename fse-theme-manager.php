<?php
/**
 * Plugin Name: FSE Theme Manager
 * Plugin URI: wpengine.com
 * Description: This plugin helps you create and maintain Full Site Editing themes for WordPress.
 * Version: 1.0.0
 * Author:
 * Text Domain: fse-theme-manager
 * Domain Path: languages
 * License: GPLv2 or later
 * Namespace: FseThemeManager
 *
 * @package fse-theme-manager
 */

namespace FseThemeManager;

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
