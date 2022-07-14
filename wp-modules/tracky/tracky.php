<?php
/**
 * Module: Tracky
 * Description: This module contains functions to help with event tracking.
 * Namespace: Tracky
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\Tracky;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Function that sends event data to WP Engine.
 */
function send_event( $event_data ) {
	// If this user should not be tracked, do nothing.
	if ( defined( 'FSESTUDIO_DO_NOT_TRACK' ) && FSESTUDIO_DO_NOT_TRACK ) {
		return;
	}

	// Create a hash that is anonymous t use as the ID.
	$anonymous_user_id = wp_hash( get_bloginfo( 'url' ) . get_current_user_id() );

	// Send an event to WP Engine.
	$result = wp_remote_post(
		//'https://tracky.wpengine.com/wp-json/tracky/v1/log-event',
		'http://frost.local/wp-json/tracky/v1/log-event',
		array(
			'method'  => 'POST',
			'headers' => array(),
			'body'    => array(
				'event_data' => json_encode(
					array_merge(
						array(
							'userId'          => $anonymous_user_id,
							'trackingVersion' => '1.0.0',
						),
						$event_data
					)
				),
			),
		),
	);

}
