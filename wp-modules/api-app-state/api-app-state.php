<?php
/**
 * Module Name: API App State
 * Description: This module creates an api endpoint for getting the state of the app.It reads the disk for pattern files, theme files, and more, and returns the status so the app can be sure it is in an accurate state at any time.
 * Namespace: ApiAppState
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\ApiAppState;

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
		'/get-app-state',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => __NAMESPACE__ . '\get_app_state',
				'permission_callback' => __NAMESPACE__ . '\permission_check',
			),
			'schema' => 'response_item_schema',
		)
	);
}

/**
 * Get the current state needed to render the app based on what is on the disk.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */
function get_app_state( $request ) {

	$app_state = \FseStudio\App\get_app_state();

	if ( ! $app_state ) {
		return new \WP_REST_Response(
			array(
				'error' => 'something-went-wrong',
			),
			200
		);
	} else {
		return new \WP_REST_Response( $app_state, 200 );
	}
}

/**
 * Check the permissions required to take this action.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return bool
 */
function permission_check( $request ) {
	return true;
	return current_user_can( 'manage_options' );
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
		'title'      => 'get_app_state',
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
