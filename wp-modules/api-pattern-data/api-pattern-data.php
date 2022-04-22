<?php
/**
 * Module Name: API Pattern Data
 * Description: This module adds a REST API endpoint for getting/setting pattern data.
 * Namespace: ApiPatternData
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\ApiPatternData;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the routes for the objects of the controller.
 */
function register_routes() {
	$version   = '1';
	$namespace = 'fsestudio/v' . $version;
	register_rest_route(
		$namespace,
		'/get-pattern',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => __NAMESPACE__ . '\get_pattern',
				'permission_callback' => __NAMESPACE__ . '\permission_check',
				'args'                => get_request_args(),
			),
			'schema' => 'response_item_schema',
		)
	);
	register_rest_route(
		$namespace,
		'/save-pattern',
		array(
			array(
				'methods'             => 'POST',
				'callback'            => __NAMESPACE__ . '\save_pattern',
				'permission_callback' => __NAMESPACE__ . '\permission_check',
				'args'                => save_request_args(),
			),
			'schema' => 'response_item_schema',
		)
	);
}

/**
 * Get a pattern's data.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */
function get_pattern( $request ) {
	$params = $request->get_params();

	$pattern_id = $params['patternId'];

	$pattern_data = \FseStudio\PatternDataHandlers\get_pattern( $pattern_id );

	if ( ! $pattern_data ) {
		return new \WP_REST_Response(
			array(
				'error' => 'pattern-not-found',
			),
			200
		);
	} else {
		return new \WP_REST_Response( $pattern_data, 200 );
	}
}

/**
 * Save a pattern's data.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */
function save_pattern( $request ) {
	$pattern_data = $request->get_params();

	$result = \FseStudio\PatternDataHandlers\update_pattern( $pattern_data );

	if ( ! $result ) {
		return new \WP_REST_Response( $result, 400 );
	} else {
		$pattern_data = \FseStudio\PatternDataHandlers\get_pattern( $pattern_data['name'] );
		return new \WP_REST_Response(
			array(
				'success'     => true,
				'message'     => __( 'Pattern saved', 'fse-studio' ),
				'patternData' => $pattern_data,
			),
			200
		);
	}
}

/**
 * Check the permissions required to take this action.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return bool
 */
function permission_check( $request ) {
	return current_user_can( 'manage_options' );
}

/**
 * Required args for a get request.
 *
 * @return array
 */
function get_request_args() {
	$return_args = array(
		'patternId' => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The directory name of the theme in question', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_string',
			'sanitize_callback' => 'sanitize_text_field',
		),
	);

	return $return_args;
}

/**
 * Required args for a save request.
 *
 * @return array
 */
function save_request_args() {
	$return_args = array(
		'type'       => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The type of pattern this is; default, or custom', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_string',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'name'       => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_string',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'title'      => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_string',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'content'    => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_string',

		),
		'categories' => array(
			'required'          => false,
			'type'              => 'array',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => '__return_true',
		),
		'blockTypes' => array(
			'required'          => false,
			'type'              => 'array',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => '__return_true',
		),
	);

	return $return_args;
}

/**
 * Validation callback for simple string parameters.
 *
 * @param mixed           $value   Value of the the parameter.
 * @param WP_REST_Request $request Current request object.
 * @param string          $param   The name of the parameter.
 */
function validate_arg_is_string( $value, $request, $param ) {
	$attributes = $request->get_attributes();

	if ( isset( $attributes['args'][ $param ] ) ) {
		$argument = $attributes['args'][ $param ];
		// Check to make sure our argument is a string.

		if ( 'string' === $argument['type'] && ! is_string( $value ) ) {
			// Translators: 1: The name of the paramater in question. 2: The required variable type.
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not of type %2$s', 'fse-studio' ), $param, 'string' ), array( 'status' => 400 ) );
		}
	} else {
		// Translators: The name of the paramater which was passed, but not registered.
		return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not registered as a request argument.', 'fse-studio' ), $param ), array( 'status' => 400 ) );
	}

	// If we got this far then the data is valid.
	return true;
}

/**
 * Initialize the REST route.
 *
 * @since 1.0.0
 * @return void
 */
function instantiate_rest_api_routes() {
	register_routes();
}
add_action( 'rest_api_init', __NAMESPACE__ . '\instantiate_rest_api_routes', 11 );

/**
 * Retrieves the item's schema, conforming to JSON Schema.
 * The properties value is what you can expect to see in a successful return/response from this endpoint.
 *
 * @since 1.0.0
 *
 * @return array Item schema data.
 */
function response_item_schema() {
	return array(
		// This tells the spec of JSON Schema we are using which is draft 4.
		'$schema'    => 'https://json-schema.org/draft-04/schema#',
		// The title property marks the identity of the resource.
		'title'      => 'get_pattern',
		'type'       => 'object',

		// These define the items which will actually be returned by the endpoint.
		'properties' => array(
			'themeData' => array(
				'description' => esc_html__( 'The theme data in question', 'fse-studio' ),
				'type'        => 'string',
				'readonly'    => true,
			),
		),
	);
}
