<?php
/**
 * FSE Theme Manager App.
 *
 * @package fse-studio
 */

namespace FseStudio\App;

/**
 * Exit if accessed directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render and enqueue the output required for the the app.
 */
function fse_studio_app() {
	global $post;

	$default_post_id = get_option( 'fse_studio_default_post_id' );

	if ( ! $_GET['post'] ) { //phpcs:ignore.
		return;
	}

	if ( is_admin() ) {
		if ( absint( $_GET['post'] ) !== absint( $default_post_id ) ) { //phpcs:ignore.
			return;
		}
	}

	$module_dir_path = module_dir_path( __FILE__ );
	$module_dir_url  = module_dir_url( __FILE__ );

	if ( file_exists( $module_dir_path . 'includes/js/build/index.asset.php' ) ) {
		$dependencies = require $module_dir_path . 'includes/js/build/index.asset.php';
		$dependencies = $dependencies['dependencies'];
	} else {
		return;
	}

	// Include the app.
	$js_url = $module_dir_url . 'includes/js/build/index.js';
	$js_ver = filemtime( $module_dir_path . 'includes/js/build/index.js' );
	wp_enqueue_script( 'fsestudio', $js_url, $dependencies, $js_ver, true );

	// Enqueue sass and Tailwind styles, combined automatically using PostCSS in wp-scripts.
	$css_url = $module_dir_url . 'includes/js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'includes/js/build/index.css' );
	wp_enqueue_style( 'fsethememanger_style', $css_url, array( 'wp-edit-blocks' ), $css_ver );

	wp_localize_script(
		'fsestudio',
		'fsestudio',
		array(
			'patterns'           => \FseStudio\PatternDataHandlers\get_patterns(),
			'themes'             => \FseStudio\ThemeDataHandlers\get_the_themes(),
			'themeJsonFiles'     => \FseStudio\ThemeJsonDataHandlers\get_all_theme_json_files(),
			'frontendPreviewUrl' => get_permalink( $default_post_id ),
			'apiEndpoints'       => array(
				'getPatternEndpoint'        => get_bloginfo( 'url' ) . '/wp-json/fsestudio/v1/get-pattern/',
				'savePatternEndpoint'       => get_bloginfo( 'url' ) . '/wp-json/fsestudio/v1/save-pattern/',
				'getThemeEndpoint'          => get_bloginfo( 'url' ) . '/wp-json/fsestudio/v1/get-theme/',
				'saveThemeEndpoint'         => get_bloginfo( 'url' ) . '/wp-json/fsestudio/v1/save-theme/',
				'getThemeJsonFileEndpoint'  => get_bloginfo( 'url' ) . '/wp-json/fsestudio/v1/get-themejson-file/',
				'saveThemeJsonFileEndpoint' => get_bloginfo( 'url' ) . '/wp-json/fsestudio/v1/save-themejson-file/',
			),
			'siteUrl'            => get_bloginfo( 'url' ),
			'defaultPostId'      => $default_post_id,
		),
	);

	echo '<div id="fsestudioapp"></div>';
}
add_action( 'admin_footer', __NAMESPACE__ . '\fse_studio_app' );

/**
 * Add a menu item to the WP Dashboard to access to app easily.
 */
function fsestudio_linked_url() {
	add_menu_page( 'fsestudio', 'FSE Studio', 'read', 'fse_studio', '', 'dashicons-text', 1 );
}
add_action( 'admin_menu', __NAMESPACE__ . '\fsestudio_linked_url' );

/**
 * Set the URL for the link in the menu.
 */
function fsestudio_linkedurl_function() {
	global $menu;
	$default_post_id = get_option( 'fse_studio_default_post_id' );
	$menu[1][2]      = admin_url( 'post.php?post=' . $default_post_id . '&action=edit' ); // phpcs:ignore
}
add_action( 'admin_menu', __NAMESPACE__ . '\fsestudio_linkedurl_function' );
