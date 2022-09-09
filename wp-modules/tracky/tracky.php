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
 *
 * @param array $event_data The data to send to be logged.
 */
function send_event( $event_data ) {
	// If this user should not be tracked, do nothing.
	if ( defined( 'FSESTUDIO_DO_NOT_TRACK' ) && FSESTUDIO_DO_NOT_TRACK ) {
		return;
	}

	$current_user = wp_get_current_user();

	// Create a hash that is anonymous to use as the ID.
	//$user_identifier = wp_hash( get_bloginfo( 'url' ) . get_current_user_id() );

	// Instead of anonymously tracking, FSE Studio is now tracking user emails with every action taken.
	$user_identifier = $current_user->user_email;

	// Send an event to WP Engine.
	$result = wp_remote_post(
		'https://fsestudiodata.wpengine.com/wp-json/tracky/v1/log-event',
		array(
			'method'  => 'POST',
			'headers' => array(),
			'body'    => array(
				'event_data' => wp_json_encode(
					array_merge(
						array(
							'userId'          => $user_identifier,
							'trackingVersion' => '1.0.1',
						),
						$event_data
					)
				),
			),
		),
	);
}
