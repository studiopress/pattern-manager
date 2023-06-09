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
	return array(
		'patterns'                 => \PatternManager\PatternDataHandlers\get_theme_patterns_with_editor_links(),
		'patternCategories'        => \WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered(),
		'apiNonce'                 => wp_create_nonce( 'wp_rest' ),
		'apiEndpoints'             => array(
			'deletePatternEndpoint'         => get_rest_url( false, 'pattern-manager/v1/delete-pattern/' ),
			'updateDismissedThemesEndpoint' => get_rest_url( false, 'pattern-manager/v1/update-dismissed-themes/' ),
		),
		'siteUrl'                  => get_bloginfo( 'url' ),
		'adminUrl'                 => admin_url(),
		'showVersionControlNotice' => check_version_control_notice_should_show( wp_get_theme()->get( 'Name' ) ),
		'localWpTrackingEnabled'   => \PatternManager\LocalWpDataHandlers\user_tracking_enabled(),
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
	wp_enqueue_style( 'pattern_manager_style', $css_url, array( 'wp-edit-blocks' ), $css_ver );

	wp_localize_script(
		'pattern-manager',
		'patternManager',
		get_app_state()
	);

	if ( \PatternManager\LocalWpDataHandlers\user_tracking_enabled() ) {
		$user_data = \PatternManager\LocalWpDataHandlers\get_user_data();
		$current_request_uri = isset( $_SERVER['REQUEST_URI']  ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : 'notFound';

		wp_add_inline_script(
			'pattern-manager',
			'
// Load the segment analytics library.
!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="YOUR_WRITE_KEY";analytics.SNIPPET_VERSION="4.15.2";
	analytics.load("YOUR_WRITE_KEY");
	analytics.page();
	}}();

// Identify who this user is.
analytics.identify(\'' . esc_attr( $user_data['id'] ) . '\', {
	name: \'' . esc_attr( $user_data['name'] ) . '\',
	email: \'' . esc_attr( $user_data['email'] ) . '\'
});

// Track that the user has loaded the App page of Pattern Manager.
analytics.track(\'Loaded Pattern Manager Pattern(S) Page\', {
	url: \'' . esc_attr( $current_request_uri ) . '\'
});
			'
		);
	}

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
