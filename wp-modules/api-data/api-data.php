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
				// The title property marks the identity of the resource.
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
			'schema'              => array(
				'$schema'    => 'https://json-schema.org/draft-04/schema#',
				'type'       => 'object',
				'properties' => array(
					'pattern' => array(
						'description' => esc_html__( 'The pattern data', 'pattern-manager' ),
						'type'        => 'object',
						'readonly'    => true,
					),
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
			'schema'              => array(
				'$schema'    => 'https://json-schema.org/draft-04/schema#',
				'type'       => 'object',
				'properties' => array(
					'patterns' => array(
						'description' => esc_html__( 'The patterns data', 'pattern-manager' ),
						'type'        => 'object',
						'readonly'    => true,
					),
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
	$result = \PatternManager\PatternDataHandlers\get_pattern_names();

	return $result
		? new \WP_REST_Response(
			array(
				'patternNames' => $result,
			),
			200
		)
		: new \WP_REST_Response( $result, 400 );
}

/**
 * Saves a single pattern.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_REST_Response
 */
function save_pattern( $request ) {
	$result = \PatternManager\PatternDataHandlers\update_pattern( $request->get_params()['pattern'] );

	return $result
		? new \WP_REST_Response(
			array(
				'message' => __( 'Pattern saved to disk', 'pattern-manager' ),
			),
			200
		)
		: new \WP_REST_Response( $result, 400 );
}

/**
 * Saves patterns.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_REST_Response
 */
function save_patterns( $request ) {
	$result = \PatternManager\PatternDataHandlers\update_patterns( $request->get_params()['patterns'] );

	return is_wp_error( $result )
		? new \WP_REST_Response( $result, 400 )
		: new \WP_REST_Response(
			array(
				'message'  => __( 'Patterns saved to disk', 'pattern-manager' ),
				'patterns' => $result,
			),
			200
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

/**
 * Required args for a save request.
 *
 * @return array
 */
function save_request_args() {
	return array(
		'patterns' => array(
			'required'          => true,
			'type'              => 'object',
			'description'       => __( 'The patterns', 'pattern-manager' ),
			'validate_callback' => function( $to_validate ) {
				return is_array( $to_validate );
			},
		),
	);
}

/**
 * Retrieves the item's schema, conforming to JSON Schema.
 * The properties value is what you can expect to see in a successful return/response from this endpoint.
 *
 * @return array Item schema data.
 */
function response_item_schema() {
	return array(
		// This tells the spec of JSON Schema we are using which is draft 4.
		'$schema'    => 'https://json-schema.org/draft-04/schema#',
		// The title property marks the identity of the resource.
		'type'       => 'object',

		// These define the items which will actually be returned by the endpoint.
		'properties' => array(
			'patterns' => array(
				'description' => esc_html__( 'The pattern data', 'pattern-manager' ),
				'type'        => 'object',
				'readonly'    => true,
			),
		),
	);
}
