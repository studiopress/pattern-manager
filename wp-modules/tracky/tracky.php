<?php
/**
 * Module: Tracky
 * Description: This module contains functions to help with event tracking.
 * Namespace: Tracky
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\Tracky;

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
	if ( defined( 'PATTERN_MANAGER_DO_NOT_TRACK' ) && PATTERNMANAGER_DO_NOT_TRACK ) {
		return;
	}

	$current_user = wp_get_current_user();

	// Instead of anonymously tracking, Pattern Manager is now tracking user emails with every action taken.
	$user_identifier = $current_user->user_email;

	// Send an event to WP Engine.
	$result = wp_remote_post(
		'https://patternmanagerdata.wpengine.com/wp-json/tracky/v1/log-event',
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
