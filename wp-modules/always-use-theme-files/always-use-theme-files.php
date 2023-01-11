<?php
/**
 * Module Name: Always use theme files.
 * Description: This modules makes it so that database overrides are never used, and the theme files are the source of truth at all times.
 * Namespace: AlwaysUseThemeFiles
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\AlwaysUseThemeFiles;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Hook into the posts query to make sure we never use an FSE post type, and thus always pull from files directly.
 *
 * @param WP_Post[]|int[]|null $posts Return an array of post data to short-circuit WP's query,
 * or null to allow WP to run its normal queries.
 * @param WP_Query             $query The WP_Query instance (passed by reference).
 */
function ignore_db_queries( $posts, $query ) {
	if ( ! isset( $query->query['post_type'] ) ) {
		return $posts;
	}

	if (
		// We are intentionally not blocking global styles from using the db. 'wp_global_styles' === $query->query['post_type'] ||.
		'wp_template' === $query->query['post_type'] ||
		'wp_template_part' === $query->query['post_type']
	) {
		return array();
	}

	return $posts;
}
add_filter( 'posts_pre_query', __NAMESPACE__ . '\ignore_db_queries', 10, 2 );

/**
 * When creating a new template, we need to return a mocked version, as though it exists on the disk.
 *
 * @param WP_Block_Template[] $query_result Array of found block templates.
 * @param array               $query {
 * Optional. Arguments to retrieve templates.
 *
 * @type array  $slug__in List of slugs to include.
 * @type int    $wp_id Post ID of customized template.
 * }
 * @param string              $template_type wp_template or wp_template_part.
 */
function filter_query_when_creating_new_template( $query_result, $query, $template_type ) {
	global $patternmanager_global_rest_request;

	if ( ! is_object( $patternmanager_global_rest_request ) ) {
		return $query_result;
	}

	$request_params = $patternmanager_global_rest_request->get_params();

	// If we are creating a new template, the slug exists.
	// See: https://github.com/WordPress/wordpress-develop/blob/bd08b221273b8b367a18fef8c9efb873819ac89d/src/wp-includes/rest-api/endpoints/class-wp-rest-templates-controller.php#L373.
	if ( isset( $request_params['slug'] ) ) {
		$theme_name               = wp_get_theme()->stylesheet;
		$template                 = new \WP_Block_Template();
		$template->id             = $theme_name . '//' . sanitize_title( $request_params['slug'] );
		$template->theme          = $theme_name;
		$template->content        = $request_params['content'];
		$template->slug           = $theme_name . '//' . sanitize_title( $request_params['slug'] );
		$template->source         = 'theme';
		$template->type           = 'wp_template';
		$template->title          = $request_params['title'];
		$template->description    = $request_params['description'];
		$template->status         = 'publish';
		$template->has_theme_file = true;
		$template->is_custom      = true;

		return array( $template );
	}

	return $query_result;
}
add_filter( 'get_block_templates', __NAMESPACE__ . '\filter_query_when_creating_new_template', 10, 3 );

/**
 * This globalizes the rest request so we can access it inside the get_block_templates filter.
 *
 * @since 4.4.0
 *
 * @param mixed           $result  Response to replace the requested version with. Can be anything
 *                                 a normal endpoint can return, or null to not hijack the request.
 * @param WP_REST_Server  $server  Server instance.
 * @param WP_REST_Request $request Request used to generate the response.
 */
function globalize_rest_request( $result, $server, $request ) {
	global $patternmanager_global_rest_request;
	$patternmanager_global_rest_request = $request;
}
add_filter( 'rest_pre_dispatch', __NAMESPACE__ . '\globalize_rest_request', 10, 3 );
