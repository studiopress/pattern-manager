<?php
/**
 * Module Name: API Theme Data
 * Description: This module adds a REST API endpoint for getting/setting theme data.
 * Namespace: ApiThemeData
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\ApiThemeData;

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
	$namespace = 'patternmanager/v' . $version;
	register_rest_route(
		$namespace,
		'/get-patterns',
		array(
			array(
				'methods'             => 'POST',
				'callback'            => 'PatternManager\PatternDataHandlers\get_theme_patterns',
				'permission_callback' => __NAMESPACE__ . '\permission_check',
				'args'                => array(),
			),
			'schema' => 'response_item_schema',
		)
	);
	register_rest_route(
		$namespace,
		'/save-patterns',
		array(
			array(
				'methods'             => 'POST',
				'callback'            => 'PatternManager\PatternDataHandlers\get_theme_patterns',
				'permission_callback' => __NAMESPACE__ . '\permission_check',
				'args'                => save_request_args(),
			),
			'schema' => 'response_item_schema',
		)
	);
}

/**
 * Get a theme's data.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */
function get_theme( $request ) {
	$theme_data = \PatternManager\ThemeDataHandlers\get_theme();

	if ( ! $theme_data ) {
		return new \WP_REST_Response(
			array(
				'error' => 'theme_not_found',
			),
			200
		);
	} else {
		return new \WP_REST_Response( $theme_data, 200 );
	}
}

/**
 * Save a theme's data.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */
function save_theme( $request ) {
	$theme_data       = $request->get_params();
	$prior_theme_data = \PatternManager\ThemeDataHandlers\get_theme();

	$result = \PatternManager\ThemeDataHandlers\update_theme( $theme_data, false );

	if ( is_wp_error( $result ) ) {
		return new \WP_REST_Response( $result, 400 );
	} else {
		return new \WP_REST_Response(
			array(
				'message'           => __( 'Theme successfully saved to disk', 'pattern-manager' ),
				'themeData'         => $result,
				'themeJsonModified' => $result['theme_json_file'] !== $prior_theme_data['theme_json_file'],
				'styleJsonModified' => $result['styles'] !== $prior_theme_data['styles'],
			),
			200
		);
	}
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
	$return_args = array(
		'patterns' => array(
			'required'          => false,
			'type'              => 'object',
			'description'       => __( 'The name of the theme', 'pattern-manager' ),
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
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not of type %2$s', 'pattern-manager' ), $param, 'string' ), array( 'status' => 400 ) );
		}
	} else {
		// Translators: The name of the paramater which was passed, but not registered.
		return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not registered as a request argument.', 'pattern-manager' ), $param ), array( 'status' => 400 ) );
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
			'themeData' => array(
				'description' => esc_html__( 'The theme data in question', 'pattern-manager' ),
				'type'        => 'string',
				'readonly'    => true,
			),
		),
	);
}
