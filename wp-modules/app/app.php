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

function install_pm_body_on_localwp_site( $site_path ) {
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$site_wp_content_path = trailingslashit( $site_path . '/wp-content/' );

	// Copy Pattern Manager plugin into the site's plugins directory, and activate it.
	if ( ! $wp_filesystem->exists( $site_wp_content_path . '/mu-plugins/pattern-manager-body/' ) ) {
		// Make sure the mu-plugins directory exists on this site.
		if ( ! $wp_filesystem->exists( $site_wp_content_path . '/mu-plugins/' ) ) {
			$wp_filesystem->mkdir( $site_wp_content_path . '/mu-plugins/' );
			
		}
		// Create a plugin called pattern-manager-body in the mu plugins directory on this site.
		if ( ! $wp_filesystem->exists( $site_wp_content_path . '/mu-plugins/pattern-manager-body/' ) ) {
			
			
			$wp_filesystem->mkdir( $site_wp_content_path . 'mu-plugins/pattern-manager-body/' );
			
			// Copy the main pattern-manager.php file into our new plugin.
			$wp_filesystem->copy( dirname( dirname( dirname( __FILE__ ) ) ) . '/pattern-manager-body.php', $site_wp_content_path . 'mu-plugins/pattern-manager-body.php' );
			
			// Make a wp-modules directory in this plugin.
			$wp_filesystem->mkdir( $site_wp_content_path . 'mu-plugins/pattern-manager-body/wp-modules/' );
		}

		// Copy the modules we want into this plugin on this site.
		$wp_modules_dir = dirname( dirname( __FILE__ ) );

		$wp_filesystem->mkdir( $site_wp_content_path . '/mu-plugins/pattern-manager-body/wp-modules/pattern-data-handlers' );
		copy_dir( $wp_modules_dir . '/pattern-data-handlers', $site_wp_content_path . 'mu-plugins/pattern-manager-body/wp-modules/pattern-data-handlers' );
		$wp_filesystem->mkdir( $site_wp_content_path . '/mu-plugins/pattern-manager-body/wp-modules/pattern-preview-renderer' );
		copy_dir( $wp_modules_dir . '/pattern-preview-renderer', $site_wp_content_path . 'mu-plugins/pattern-manager-body/wp-modules/pattern-preview-renderer' );
		$wp_filesystem->mkdir( $site_wp_content_path . '/mu-plugins/pattern-manager-body/wp-modules/get-wp-filesystem' );
		copy_dir( $wp_modules_dir . '/get-wp-filesystem', $site_wp_content_path . 'mu-plugins/pattern-manager-body/wp-modules/get-wp-filesystem' );
	}
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
			
			if(
				! str_contains( $theme_paths[0], 'timothy' ) &&
				! str_contains( $theme_paths[0], 'mechanic' )
			) {
				continue;
			}
			
			// Install a minified version of PM on this site.
			install_pm_body_on_localwp_site( $local_site_data['path'] . '/app/public/' );
			
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

function takeover() {
	if ( ! isset( $_GET['pm_takeover'] ) ) {
		return;
	}

	\wp_head();
	?>
	<style>
		.pattern-manager-header-container{top:0!important;}
	</style>
	<?php
	pattern_manager_app();
	\wp_footer();
	die();
	
}
add_action('init', __NAMESPACE__ . '\takeover' );
