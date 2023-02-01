<?php
/**
 * Module Name: App
 * Description: The browser app where the work gets done.
 * Namespace: App
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\App;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the values needed to render/hydrate the app.
 */
function get_app_state() {
	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	return array(
		'patterns'     => \PatternManager\PatternDataHandlers\get_theme_patterns(),
		'apiNonce'     => wp_create_nonce( 'wp_rest' ),
		'apiEndpoints' => array(
			'savePatternEndpoint'  => get_rest_url( false, 'pattern-manager/v1/save-pattern/' ),
			'savePatternsEndpoint' => get_rest_url( false, 'pattern-manager/v1/save-patterns/' ),
		),
		'siteUrl'      => get_bloginfo( 'url' ),
		'adminUrl'     => admin_url(),
	);
}

/**
 * Render and enqueue the output required for the the app.
 */
function pattern_manager_app() {
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
	wp_enqueue_script( 'pattern-manager', $js_url, $dependencies, $js_ver, true );

	// Enqueue sass and Tailwind styles, combined automatically using PostCSS in wp-scripts.
	$css_url = $module_dir_url . 'js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'js/build/index.css' );
	wp_enqueue_style( 'theme_manager_style', $css_url, array( 'wp-edit-blocks' ), $css_ver );

	wp_localize_script(
		'pattern-manager',
		'patternManager',
		get_app_state()
	);

	echo '<div id="pattern-manager-app"></div>';
}

/**
 * Set the URL for the link in the menu.
 */
function patternmanager_adminmenu_page() {
	add_menu_page(
		__( 'Patterns', 'pattern-manager' ),
		__( 'Patterns', 'pattern-manager' ),
		'administrator',
		'pattern-manager',
		__NAMESPACE__ . '\pattern_manager_app',
		'dashicons-text',
		$position = 2,
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\patternmanager_adminmenu_page' );

/**
 * Unhook all the admin_notices.
 *
 * @return void
 */
function hide_admin_notices() {
	if ( 'pattern-manager' === filter_input( INPUT_GET, 'page' ) ) {
		remove_all_actions( 'admin_notices' );
	}
}
add_action( 'admin_head', __NAMESPACE__ . '\hide_admin_notices', 1 );
