<?php
/**
 * Module Name: Always use theme files.
 * Description: This modules makes it so that FSE database overrides are never used, and the theme files are the source of truth at all times.
 * Namespace: AlwaysUseThemeFiles
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\AlwaysUseThemeFiles;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Hook into the posts query to make sure we never use an FSE post type, and thus always pull from files directly.
 *
 * @param WP_Post[]|int[]|null $posts Return an array of post data to short-circuit WP's query,
 * or null to allow WP to run its normal queries.
 * @param WP_Query   $query The WP_Query instance (passed by reference).
 */
function always_use_theme_files( $posts, $query ) {
	if ( ! isset( $query->query['post_type'] ) ) {
		return $posts;
	}

	if (
		'wp_global_styles' === $query->query['post_type'] ||
		'wp_template' === $query->query['post_type'] ||
		'wp_template_part' === $query->query['post_type']
	) {
		return array();
	}

	return $posts;
}
add_filter( 'posts_pre_query', __NAMESPACE__ . '\always_use_theme_files', 10, 2 );

/**
 * Filters the queried block template object after it's been fetched.
 *
 * @since 5.9.0
 *
 * @param WP_Block_Template|null $block_template The found block template, or null if there isn't one.
 * @param string                 $id   Template unique identifier (example: theme_slug//template_slug).
 * @param string                 $template_type  Template type: `'wp_template'` or '`wp_template_part'`.
 */
function kjhsdgkjhsg( $block_template, $id, $template_type ) {
	$theme_template_files = \FseStudio\PatternDataHandlers\get_theme_templates();
	$theme_template_file = $theme_template_files[ $id ];
	$theme = wp_get_theme()->get_stylesheet();

	$template                 = new \WP_Block_Template();
	$template->id             = $id;
	$template->theme          = $theme;
	$template->content        = '';
	$template->slug           = $id;
	$template->source         = 'theme';
	$template->type           = 'wp_template';
	$template->title          = $theme_template_file['title'];
	$template->status         = 'publish';
	$template->has_theme_file = true;
	$template->is_custom      = true;
	return $template;
}
add_filter( 'get_block_template', __NAMESPACE__ . '\kjhsdgkjhsg', 10, 3 );

/**
 * Filters the array of queried block templates array after they've been fetched.
 *
 * @since 5.9.0
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
function kjhsdgjkhsg( $query_result, $query, $template_type ) {
	// To do: Hook into current rest request to see if it contains a slug. Might need to do this globally.
	// Then, return the template from the theme file here.

	global $fsestudio_global_rest_request;
	if ( $fsestudio_global_rest_request instanceof WP_REST_Request ) {
		// Otherwise, just return all theme template files.
		$theme_name = wp_get_theme()->stylesheet;

		$request_params = $fsestudio_global_rest_request->get_params();

		if ( isset( $request_params['slug'] ) ) {
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
	} else {
		return $query_result;
	}

}
add_filter( 'get_block_templates', __NAMESPACE__ . '\kjhsdgjkhsg', 10, 3 );

/**
         * Filters the pre-calculated result of a REST API dispatch request.
         *
         * Allow hijacking the request before dispatching by returning a non-empty. The returned value
         * will be used to serve the request instead.
         *
         * @since 4.4.0
         *
         * @param mixed           $result  Response to replace the requested version with. Can be anything
         *                                 a normal endpoint can return, or null to not hijack the request.
         * @param WP_REST_Server  $server  Server instance.
         * @param WP_REST_Request $request Request used to generate the response.
         */
function kjsdgkjsdg( $result, $server, $request ) {
	global $fsestudio_global_rest_request;
	$fsestudio_global_rest_request = $request;
}
add_filter( 'rest_pre_dispatch', __NAMESPACE__ . '\kjsdgkjsdg', 10, 3 );
