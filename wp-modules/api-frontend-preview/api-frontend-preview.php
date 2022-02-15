<?php
/**
 * Module Name: API Frontend Preview
 * Description: This module adds a REST API endpoint for getting/setting theme json data.
 * Namespace: ApiFrontendPreview
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\ApiFrontendPreview;

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
		'/get-frontend-preview-parts',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => __NAMESPACE__ . '\get_frontend_preview_parts',
				'permission_callback' => __NAMESPACE__ . '\get_frontend_preview_parts_permission_check',
			),
			'schema' => 'response_item_schema',
		)
	);
}

/**
 * Get the preview parts for a frontend preview.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */
function get_frontend_preview_parts( $request ) {
	$params = $request->get_params();

	$frontend_preview_parts = array(
		'wpHead'   => get_wp_head(),
		'wpFooter' => get_wp_footer(),
	);

	if ( ! $frontend_preview_parts ) {
		return new \WP_REST_Response(
			array(
				'error' => 'something_went_wrong',
			),
			200
		);
	} else {
		return new \WP_REST_Response( $frontend_preview_parts, 200 );
	}
}

/**
 * Set the URL for the link in the menu.
 *
 * @return string
 */
function get_wp_head() {
	ob_start();
	do_action( 'wp_head' ); //phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
	return ob_get_clean();
}

/**
 * Get the HTML for the wp_footer hook as a string.
 *
 * @return string
 */
function get_wp_footer() {
	ob_start();
	do_action( 'wp_footer' ); //phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
	return ob_get_clean();
}

/**
 * Check the permissions required to take this action.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|bool
 */
function get_frontend_preview_parts_permission_check( $request ) {
	return true;
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
