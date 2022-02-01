<?php
/**
 * FSE Theme Manager App.
 *
 * @package fse-theme-manager
 */

namespace FseThemeManager\App;

/**
 * Exit if accessed directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render and enqueue the output required for the the app.
 */
function fse_theme_manager_app() {
	global $post;

	$default_post_id = get_option( 'fse_theme_manager_default_post_id' );

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
	wp_enqueue_script( 'fsethememanager', $js_url, $dependencies, $js_ver, true );

	// Enqueue sass styles.
	$css_url = $module_dir_url . 'includes/js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'includes/js/build/index.css' );
	wp_enqueue_style( 'fsethememanger_style', $css_url, array( 'wp-edit-blocks' ), $css_ver );

	// Enqueue tailwind styles.
	$css_url = $module_dir_url . 'includes/css/build/tailwind-style.css';
	$css_ver = filemtime( $module_dir_path . 'includes/css/build/tailwind-style.css' );
	wp_enqueue_style( 'fsethememanger_tailwind_style', $css_url, array( 'fsethememanger_style' ), $css_ver );

	wp_localize_script(
		'fsethememanager',
		'fsethememanager',
		array(
			'patterns'           => \FseThemeManager\PatternDataHandlers\get_patterns(),
			'themes'             => \FseThemeManager\ThemeDataHandlers\get_the_themes(),
			'frontendPreviewUrl' => get_permalink( $default_post_id ),
			'apiEndpoints'       => array(
				'getPatternEndpoint'  => get_bloginfo( 'url' ) . '/wp-json/fsethememanager/v1/get-pattern/',
				'savePatternEndpoint' => get_bloginfo( 'url' ) . '/wp-json/fsethememanager/v1/save-pattern/',
				'getThemeEndpoint'    => get_bloginfo( 'url' ) . '/wp-json/fsethememanager/v1/get-theme/',
				'saveThemeEndpoint'   => get_bloginfo( 'url' ) . '/wp-json/fsethememanager/v1/save-theme/',
				'getThemeJsonFileEndpoint'    => get_bloginfo( 'url' ) . '/wp-json/fsethememanager/v1/get-themejson-file/',
				'saveThemeJsonFileEndpoint'   => get_bloginfo( 'url' ) . '/wp-json/fsethememanager/v1/save-themejson-file/',
			),
			'siteUrl'            => get_bloginfo( 'url' ),
			'defaultPostId'      => $default_post_id,
		),
	);

	echo '<div id="fsethememanagerapp"></div>';
}
add_action( 'admin_footer', __NAMESPACE__ . '\fse_theme_manager_app' );

/**
 * Add a menu item to the WP Dashboard to access to app easily.
 */
function fsethememanager_linked_url() {
	add_menu_page( 'fsethememanager', 'FSE Theme Manager', 'read', 'fse_theme_manager', '', 'dashicons-text', 1 );
}
add_action( 'admin_menu', __NAMESPACE__ . '\fsethememanager_linked_url' );

/**
 * Set the URL for the link in the menu.
 */
function fsethememanager_linkedurl_function() {
	global $menu;
	$default_post_id = get_option( 'fse_theme_manager_default_post_id' );
	$menu[1][2]      = admin_url( 'post.php?post=' . $default_post_id . '&action=edit' ); // phpcs:ignore
}
add_action( 'admin_menu', __NAMESPACE__ . '\fsethememanager_linkedurl_function' );
