<?php
/**
 * Module Name: App
 * Description: The browser app where the work gets done.
 * Namespace: App
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\App;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the values needed to render/hydrate the app.
 */
function get_app_state() {
	$current_theme_dir = get_template();

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$current_theme_data = null;

	// Make sure the theme WP thinks is active actually exists.
	if ( $wp_filesystem->exists( $wp_filesystem->wp_themes_dir() . $current_theme_dir . '/fsestudio-data.json' ) ) {
		$current_theme_data = json_decode( $wp_filesystem->get_contents( $wp_filesystem->wp_themes_dir() . $current_theme_dir . '/fsestudio-data.json' ), true );
	}

	return array(
		'patterns'           => \FseStudio\PatternDataHandlers\get_patterns(),
		'initialTheme'       => isset( $current_theme_data['id'] ) ? $current_theme_data['id'] : null,
		'themes'             => \FseStudio\ThemeDataHandlers\get_the_themes(),
		'schemas'            => array(
			'themejson' => wp_json_file_decode( $wp_filesystem->wp_plugins_dir() . '/fse-studio/wp-modules/schemas/json/theme.json' ),
		),
		'frontendPreviewUrl' => null,
		'apiNonce'           => wp_create_nonce( 'wp_rest' ),
		'apiEndpoints'       => array(
			'getAppState'               => get_rest_url( false, 'fsestudio/v1/get-app-state/' ),
			'getThemeEndpoint'          => get_rest_url( false, 'fsestudio/v1/get-theme/' ),
			'saveThemeEndpoint'         => get_rest_url( false, 'fsestudio/v1/save-theme/' ),
			'exportThemeEndpoint'       => get_rest_url( false, 'fsestudio/v1/export-theme/' ),
			'switchThemeEndpoint'       => get_rest_url( false, 'fsestudio/v1/switch-theme/' ),
			'getThemeJsonFileEndpoint'  => get_rest_url( false, 'fsestudio/v1/get-themejson-file/' ),
			'saveThemeJsonFileEndpoint' => get_rest_url( false, 'fsestudio/v1/save-themejson-file/' ),
		),
		'siteUrl'            => get_bloginfo( 'url' ),
		'adminUrl'           => admin_url(),
		'defaultPostId'      => null,
	);
}

/**
 * Render and enqueue the output required for the the app.
 */
function fse_studio_app() {
	$module_dir_path = module_dir_path( __FILE__ );
	$module_dir_url  = module_dir_url( __FILE__ );

	if ( file_exists( $module_dir_path . 'js/build/index.asset.php' ) ) {
		$dependencies = require $module_dir_path . 'js/build/index.asset.php';
		$dependencies = $dependencies['dependencies'];
	} else {
		return;
	}

	// Include the app.
	$js_url = $module_dir_url . 'js/build/index.js';
	$js_ver = filemtime( $module_dir_path . 'js/build/index.js' );
	wp_enqueue_script( 'fsestudio', $js_url, $dependencies, $js_ver, true );

	// Enqueue sass and Tailwind styles, combined automatically using PostCSS in wp-scripts.
	$css_url = $module_dir_url . 'js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'js/build/index.css' );
	wp_enqueue_style( 'fsethememanger_style', $css_url, array( 'wp-edit-blocks' ), $css_ver );

	wp_localize_script(
		'fsestudio',
		'fsestudio',
		get_app_state()
	);

	echo '<div id="fsestudioapp"></div>';
}

/**
 * Set the URL for the link in the menu.
 */
function fsestudio_adminmenu_page() {
	add_menu_page(
		__( 'FSE Studio', 'fse-studio' ),
		__( 'FSE Studio', 'fse-studio' ),
		'administrator',
		'fse-studio',
		__NAMESPACE__ . '\fse_studio_app',
		'dashicons-text',
		$position = 0,
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\fsestudio_adminmenu_page' );

/**
 * Unhook all the admin_notices.
 *
 * @return void
 */
function hide_admin_notices() {
	if ( 'fse-studio' === filter_input( INPUT_GET, 'page' ) ) {
		remove_all_actions( 'admin_notices' );
	}
}
add_action( 'admin_head', __NAMESPACE__ . '\hide_admin_notices', 1 );
