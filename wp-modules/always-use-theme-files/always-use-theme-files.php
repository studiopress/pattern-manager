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
 * Rename all strings in a theme's functions.php file.
 *
 * @param WP_Post[]|int[]|null $posts Return an array of post data to short-circuit WP's query,
 *                                    or null to allow WP to run its normal queries.
 * @param WP_Query             $query The WP_Query instance (passed by reference).
 */
function always_use_theme_files( $posts, $query ) {
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
