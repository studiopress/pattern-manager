<?php
/**
 * Module Tippy Tour
 * Description: This module contains the code for the tippy tour
 * Namespace: TippyTour
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\TippyTour;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Get the tour data.
$tour_data = require 'tour-data.php';

// Do nothing if the slug of the tour is not a URL param.
if ( ! isset( $_GET[ $tour_data['tourSlug'] ] ) ) {
	return;
}

/**
 * Enqueue the stepped tour file in the WpeBeacon plugin.
 */
function enqueue_stepped_tour_file() {
	if ( function_exists( 'Tippy\SteppedTour\enqueue' ) ) {
		add_action( 'init', 'Tippy\SteppedTour\enqueue' );
	}
}
add_action( 'init', __NAMESPACE__ . '\enqueue_stepped_tour_file', 9 );

/**
 * Output the javascript that creates this tour.
 */
function create_tour() {
	if ( function_exists( 'Tippy\SteppedTour\enqueue' ) ) {
		wp_add_inline_script(
			'wpe_beacon_stepped_tour',
			'wpeBeaconCreateSteppedTour(' . wp_json_encode( require 'tour-data.php' ) . ');'
		);
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\create_tour' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\create_tour' );
