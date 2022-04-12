<?php
/**
 * Module Name: Pattern Post Type
 * Description: This module registers a post type to be used when editing block patterns.
 * Namespace: StringFixer
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\PatternPostType;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Create a custom post type to be used for our default post.
 */
function pattern_post_type() {
	register_post_type(
		'fsestudio_pattern',
		array(
			'public'       => true,
			'has_archive'  => false,
			'show_ui'      => true,
			'show_in_menu' => true,
			'show_in_rest' => true,
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\pattern_post_type' );