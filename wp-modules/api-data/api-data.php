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
use function \PatternManager\GetVersionControl\get_dismissed_themes;
use function \PatternManager\GetVersionControl\get_version_control_meta_key;
use function \PatternManager\GetWpFilesystem\get_wp_filesystem_api;
use function PatternManager\PatternDataHandlers\tree_shake_theme_images;

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
		'/delete-pattern',
		array(
			'methods'             => 'DELETE',
			'callback'            => __NAMESPACE__ . '\delete_pattern',
			'permission_callback' => __NAMESPACE__ . '\permission_check',
			'args'                => array(
				'patternName' => array(
					'required'          => true,
					'type'              => 'string',
					'description'       => __( 'The pattern to delete', 'pattern-manager' ),
					'validate_callback' => function( $to_validate ) {
						return is_string( $to_validate );
					},
				),
			),
		)
	);

	register_rest_route(
		$namespace,
		'/update-dismissed-themes',
		array(
			'methods'             => 'POST',
			'callback'            => __NAMESPACE__ . '\update_dismissed_themes',
			'permission_callback' => __NAMESPACE__ . '\permission_check',
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
 * Deletes a single pattern.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_REST_Response
 */
function delete_pattern( $request ) {
	$is_success = \PatternManager\PatternDataHandlers\delete_pattern( $request->get_params()['patternName'] );
	tree_shake_theme_images( get_wp_filesystem_api(), 'copy_dir' );

	return $is_success
		? new WP_REST_Response(
			array(
				'message' => __( 'Pattern successfully deleted', 'pattern-manager' ),
			),
			200
		)
		: new WP_REST_Response( $is_success, 400 );
}

/**
 * Updates the list of theme names that should not show version control notifications.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_REST_Response
 */
function update_dismissed_themes( $request ) {
	$dismissed_themes = array_merge( get_dismissed_themes(), (array) wp_get_theme()->get( 'Name' ) );
	$is_success       = update_user_meta( get_current_user_id(), get_version_control_meta_key(), $dismissed_themes );

	return $is_success
		? new WP_REST_Response(
			array(
				'message' => __( 'Version control notifications dismissed for this theme.', 'pattern-manager' ),
			),
			200
		)
		: new WP_REST_Response( $is_success, 400 );
}

/**
 * Check the permissions required to take this action.
 *
 * @return bool
 */
function permission_check(): bool {
	return current_user_can( 'manage_options' );
}
