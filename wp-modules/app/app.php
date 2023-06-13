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

use function PatternManager\GetVersionControl\check_version_control_notice_should_show;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the values needed to render/hydrate the app.
 */
function get_app_state() {
	$local_sites = \PatternManager\LocalWpDataHandlers\get_localwp_sites();

	$local_sites_initial_state = [];

	if ( ! $local_sites ) {
		$local_sites_initial_state[] = [
			'localWpData' => $local_site_data,
			'patterns'                 => \PatternManager\PatternDataHandlers\get_theme_patterns_with_editor_links( get_stylesheet_directory() . '/patterns/' ),
			'patternCategories'        => \WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered(),
			'siteUrl'                  => get_bloginfo( 'url' ),
			'adminUrl'                 => admin_url(),
		];
	} else {
		foreach( $local_sites as $local_site_key => $local_site_data ) {
			$theme_paths = \PatternManager\PatternDataHandlers\get_sites_theme_paths($local_site_data['path']);
			if( ! isset( $theme_paths[0] ) ) {
				continue;
			}
			
			
			$local_sites_initial_state[$local_site_key] = [
				'localWpData'              => $local_site_data,
				'themePath'                => $theme_paths[0],
				'patterns'                 => \PatternManager\PatternDataHandlers\get_theme_patterns_with_editor_links( $theme_paths[0] . '/patterns/' ),
				'patternCategories'        => \WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered(),
				'adminUrl'                 => admin_url(),
			];
		}
	}
	
	return [
		'appUrl'                   => get_bloginfo( 'url' ),
		'apiNonce'                 => wp_create_nonce( 'wp_rest' ),
		'apiEndpoints'             => array(
			'deletePatternEndpoint'         => get_rest_url( false, 'pattern-manager/v1/delete-pattern/' ),
			'updateDismissedThemesEndpoint' => get_rest_url( false, 'pattern-manager/v1/update-dismissed-themes/' ),
		),
		'showVersionControlNotice' => check_version_control_notice_should_show( wp_get_theme()->get( 'Name' ) ),
		'sites' => $local_sites_initial_state,
	];
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
	wp_enqueue_style( 'pattern_manager_style', $css_url, array( 'wp-edit-blocks' ), $css_ver );

	wp_localize_script(
		'pattern-manager',
		'patternManager',
		get_app_state()
	);

	echo '<div id="pattern-manager-app"></div>';
}

/**
 * Set the URL for the link in the menu.
 *
 * @return string The page's hook suffix.
 */
function pattern_manager_admin_menu_page() {
	return add_menu_page(
		__( 'Patterns', 'pattern-manager' ),
		__( 'Patterns', 'pattern-manager' ),
		'administrator',
		'pattern-manager',
		__NAMESPACE__ . '\pattern_manager_app',
		'dashicons-text',
		$position = 59,
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\pattern_manager_admin_menu_page' );

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
