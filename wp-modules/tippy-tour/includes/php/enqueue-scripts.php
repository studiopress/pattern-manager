<?php
/**
 * Enqueue the FSE Tour.
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\TippyTour;

/**
 * Exit if accessed directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue
 *
 * @since  1.0.0
 * @return void
 */
function enqueue() {
	$module_dir_path = module_dir_path( __FILE__ );
	$module_dir_url  = module_dir_url( __FILE__ );

	if ( file_exists( $module_dir_path . 'includes/js/build/index.asset.php' ) ) {
		$dependencies = require $module_dir_path . 'includes/js/build/index.asset.php';
		$dependencies = $dependencies['dependencies'];
	} else {
		$dependencies = array();
	}

	$dependencies[] = 'wpe_beacon';

	$js_url = $module_dir_url . 'includes/js/build/index.js';
	$js_ver = filemtime( $module_dir_path . 'includes/js/build/index.js' );
	wp_enqueue_script( 'fsestudio_wpe_beacon_views', $js_url, $dependencies, $js_ver, true );
}
add_action( 'init', __NAMESPACE__ . '\enqueue' );
