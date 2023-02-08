<?php
/**
 * Module Name: API Data
 * Description: This module adds a REST API endpoint for getting/setting pattern data.
 * Namespace: ApiData
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\ApiData;

use WP_REST_Request;
use WP_REST_Response;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the routes for the objects of the controller.
 */
function register_routes() {
	$version   = '1';
	$namespace = 'pattern-manager/v' . $version;
	register_rest_route(
		$namespace,
		'/get-pattern-names',
		array(
			'methods'             => 'GET',
			'callback'            => __NAMESPACE__ . '\get_pattern_names',
			'permission_callback' => __NAMESPACE__ . '\permission_check',
			'schema'              => array(
				// This tells the spec of JSON Schema we are using which is draft 4.
				'$schema'    => 'https://json-schema.org/draft-04/schema#',
				'type'       => 'object',
				// These define the items which will actually be returned by the endpoint.
				'properties' => array(
					'patternNames' => array(
						'description' => esc_html__( 'All pattern names', 'pattern-manager' ),
						'type'        => 'array',
						'readonly'    => true,
					),
				),
			),
		)
	);

	register_rest_route(
		$namespace,
		'/save-pattern',
		array(
			'methods'             => 'POST',
			'callback'            => __NAMESPACE__ . '\save_pattern',
			'permission_callback' => __NAMESPACE__ . '\permission_check',
			'args'                => array(
				'pattern' => array(
					'required'          => true,
					'type'              => 'object',
					'description'       => __( 'The pattern', 'pattern-manager' ),
					'validate_callback' => function( $to_validate ) {
						return is_array( $to_validate );
					},
				),
			),
		)
	);

	register_rest_route(
		$namespace,
		'/save-patterns',
		array(
			'methods'             => 'POST',
			'callback'            => __NAMESPACE__ . '\save_patterns',
			'permission_callback' => __NAMESPACE__ . '\permission_check',
			'args'                => array(
				'patterns' => array(
					'required'          => true,
					'type'              => 'object',
					'description'       => __( 'The patterns', 'pattern-manager' ),
					'validate_callback' => function( $to_validate ) {
						return is_array( $to_validate );
					},
				),
			),
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_routes', 11 );

/**
 * Gets all pattern names.
 *
 * @return WP_REST_Response
 */
function get_pattern_names() {
	$is_success = \PatternManager\PatternDataHandlers\get_pattern_names();

	return $is_success
		? new WP_REST_Response(
			array(
				'patternNames' => $is_success,
			),
			200
		)
		: new WP_REST_Response( $is_success, 400 );
}

/**
 * Saves a single pattern.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_REST_Response
 */
function save_pattern( $request ) {
	$is_success = \PatternManager\PatternDataHandlers\update_pattern( $request->get_params()['pattern'] );

	return $is_success
		? new WP_REST_Response(
			array(
				'message' => __( 'Pattern saved to disk', 'pattern-manager' ),
			),
			200
		)
		: new WP_REST_Response(
			array(
				'message' => __( 'Something went wrong while saving the pattern.', 'pattern-manager' ),
			),
			400
		);
}

/**
 * Saves multiple patterns.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_REST_Response
 */
function save_patterns( $request ) {
	$is_success = \PatternManager\PatternDataHandlers\update_patterns( $request->get_params()['patterns'] );

	return $is_success
		? new WP_REST_Response(
			array(
				'message' => __( 'Patterns successfully saved to disk', 'pattern-manager' ),
			),
			200
		)
		: new WP_REST_Response(
			array(
				'message' => __( 'Something went wrong while saving the patterns.', 'pattern-manager' ),
			),
			400
		);
}

/**
 * Check the permissions required to take this action.
 *
 * @return bool
 */
function permission_check() {
	return current_user_can( 'manage_options' );
}
