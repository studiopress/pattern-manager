<?php
/**
 * Module Name: API Theme Data
 * Description: This module adds a REST API endpoint for getting/setting theme data.
 * Namespace: ApiThemeData
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\ApiThemeData;

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
		'/get-theme',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => __NAMESPACE__ . '\get_theme',
				'permission_callback' => __NAMESPACE__ . '\permission_check',
				'args'                => get_request_args(),
			),
			'schema' => 'response_item_schema',
		)
	);
	register_rest_route(
		$namespace,
		'/save-theme',
		array(
			array(
				'methods'             => 'POST',
				'callback'            => __NAMESPACE__ . '\save_theme',
				'permission_callback' => __NAMESPACE__ . '\permission_check',
				'args'                => save_request_args(),
			),
			'schema' => 'response_item_schema',
		)
	);
	register_rest_route(
		$namespace,
		'/export-theme',
		array(
			array(
				'methods'             => 'POST',
				'callback'            => __NAMESPACE__ . '\export_theme',
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
	$params = $request->get_params();

	$theme_id = $params['themeId'];

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	if ( $wp_filesystem->exists( $wp_filesystem->wp_themes_dir() . $theme_id . '/fsestudio-data.json' ) ) {
		// Activate the theme being requested. This makes it so that previews match the currently chosen theme.
		switch_theme( $theme_id );
	}

	$theme_data = \FseStudio\ThemeDataHandlers\get_theme( $theme_id );

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
	$theme_data = $request->get_params();

	$result = \FseStudio\ThemeDataHandlers\update_theme( $theme_data );

	if ( is_wp_error( $result ) ) {
		return new \WP_REST_Response( $result, 400 );
	} else {
		return new \WP_REST_Response( __( 'Theme successfully saved to disk', 'fse-studio' ), 200 );
	}
}

/**
 * Export a theme's data to a zip file.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */
function export_theme( $request ) {
	$theme_data = $request->get_params();

	$result = \FseStudio\ThemeDataHandlers\export_theme( $theme_data );

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
		'themeId' => array(
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
		'name'              => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'dirname'           => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The directory name of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'namespace'         => array(
			'required'          => true,
			'type'              => 'string',
			'description'       => __( 'The namespace of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'uri'               => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The URI of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'author'            => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The author of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'author_uri'        => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The author URI of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'description'       => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The description of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'tags'              => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The tags for the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
		),
		'tested_up_to'      => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The WP version this theme has been tested up to', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'requires_wp'       => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The tags for the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'requires_php'      => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The tags for the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),

		'version'           => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'text_domain'       => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
			'sanitize_callback' => 'sanitize_text_field',
		),
		'theme_json_file'   => array(
			'required'          => false,
			'type'              => 'string',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
		),
		'included_patterns' => array(
			'required'          => false,
			'type'              => 'array',
			'description'       => __( 'The name of the theme', 'fse-studio' ),
			'validate_callback' => __NAMESPACE__ . '\validate_arg_is_object',
		),
		'template_files'    => array(
			'required'          => false,
			'type'              => 'object',
			'description'       => __( 'The block pattern to use for index.html', 'fse-studio' ),
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
			'themeData' => array(
				'description' => esc_html__( 'The theme data in question', 'fse-studio' ),
				'type'        => 'string',
				'readonly'    => true,
			),
		),
	);
}
