<?php
/**
 * Module Name: API Theme Json Data
 * Description: This module adds a REST API endpoint for getting/setting theme json data.
 * Namespace: ApiThemeJsonData
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\ApiThemeJsonData;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the API routes.
 */
function register_routes() {
	$version   = '1';
	$namespace = 'fsestudio/v' . $version;
	register_rest_route(
		$namespace,
		'/get-themejson-file',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => __NAMESPACE__ . '\get_themejson_file',
				'permission_callback' => __NAMESPACE__ . '\get_themejson_permission_check',
				'args'                => get_request_args(),
			),
			'schema' => 'response_item_schema',
		)
	);
	register_rest_route(
		$namespace,
		'/save-themejson-file',
		array(
			array(
				'methods'             => 'POST',
				'callback'            => __NAMESPACE__ . '\save_themejson_file',
				'permission_callback' => __NAMESPACE__ . '\save_themejson_permission_check',
				'args'                => save_request_args(),
			),
			'schema' => 'response_item_schema',
		)
	);
}

/**
 * Get a theme's Json file's data.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */
function get_themejson_file( $request ) {
	global $fsestudio_api_get_theme_json_file;
	$fsestudio_api_get_theme_json_file = true;

	$params = $request->get_params();

	$id = $params['filename'];

	$data = \FseStudio\ThemeJsonDataHandlers\get_theme_json_file( $id );

	if ( ! $data ) {
		return new \WP_REST_Response(
			array(
				'error' => 'themejson_file_not_found',
			),
			200
		);
	} else {
		return new \WP_REST_Response( $data, 200 );
	}
}

/**
 * Save a theme Json file's data.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */
function save_themejson_file( $request ) {
	$themejson_data = $request->get_params();

	$result = \FseStudio\ThemeJsonDataHandlers\update_theme_json_file( $themejson_data, array() );

	if ( is_wp_error( $result ) ) {
		return new \WP_REST_Response( $result, 400 );
	} else {
		return new \WP_REST_Response( $result, 200 );
	}
}

/**
 * Check the permissions required to take this action.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|bool
 */
function get_themejson_permission_check( $request ) {
	return true;
}

/**
 * Check the permissions required to take this action.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|bool
 */
function save_themejson_permission_check( $request ) {
	return true;
}

/**
 * Required args for a get request.
 *
 * @return array
 */
function get_request_args() {
	$return_args = array(
		'filename' => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The filename of the theme.json file', 'fse-studio' ),
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
		'name'    => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The filename of the theme.json file', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_string',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'content' => array(
			'required'          => true,
			'type'              => 'object',
			'description'       => __( 'The contents of the themejson file', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
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
 * Validation callback for simple string parameters.
 *
 * @param mixed           $value   Value of the the parameter.
 * @param WP_REST_Request $request Current request object.
 * @param string          $param   The name of the parameter.
 */
function validate_arg_is_object( $value, $request, $param ) {
	// TODO: add logic that validates the object is what we expect.
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
		'title'      => 'get_theme',
		'type'       => 'object',

		// These define the items which will actually be returned by the endpoint.
		'properties' => array(
			'themejsonData' => array(
				'description' => esc_html__( 'The themejson data in question', 'fse-studio' ),
				'type'        => 'string',
				'readonly'    => true,
			),
		),
	);
}
