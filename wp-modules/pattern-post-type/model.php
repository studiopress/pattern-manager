<?php
/**
 * Module Name: Pattern Post Type
 * Namespace: PatternPostType
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\PatternPostType;

use WP_Post;
use function PatternManager\PatternDataHandlers\get_pattern_by_name;
use function PatternManager\PatternDataHandlers\get_theme_patterns;
use function PatternManager\PatternDataHandlers\delete_pattern;
use function PatternManager\PatternDataHandlers\update_pattern;

/**
 * Gets the pattern content from the file, instead of from the post content.
 *
 * @param WP_Post $post The post to possibly add content to.
 */
function get_pattern_content_from_file( $post ) {
	if ( 'pm_pattern' !== $post->post_type ) {
		return;
	}

	if ( ! $post->post_title ) {
		return;
	}

	$post->post_content = get_pattern_by_name( $post->post_title )['content'] ?? '';
}
add_action( 'the_post', __NAMESPACE__ . '\get_pattern_content_from_file' );

/**
 * Saves the pattern to the .php file.
 *
 * @param int $post_id The post ID.
 * @param WP_Post $post The post.
 */
function save_pattern_to_file( WP_Post $post ) {
	if ( 'pm_pattern' !== $post->post_type ) {
		return;
	}

	$pattern = get_pattern_by_name( get_post_meta( $post->ID, 'name', true ) );
	if ( ! $pattern ) {
		return;
	}

	update_pattern(
		array_merge(
			$pattern,
			[
				'content' => $post->post_content,
			]
		)
	);

	// Prevent an infinite loop.
	remove_action( 'rest_after_insert_pm_pattern', __NAMESPACE__ . '\save_pattern_to_file' );

	// Removes the post content, as it should be saved in the pattern .php file.
	wp_update_post(
		[
			'ID'           => $post->ID,
			'post_content' => '',
		]
	);

	add_action( 'rest_after_insert_pm_pattern', __NAMESPACE__ . '\save_pattern_to_file' );
}
add_action( 'rest_after_insert_pm_pattern', __NAMESPACE__ . '\save_pattern_to_file' );

/**
 * Saves a meta value to the pattern file, instead of the DB.
 *
 * @param null|bool $override Whether to override Core's saving of metadata.
 * @param int $post_id The post ID.
 * @param string $meta_key The meta key to update.
 * @param mixed $meta_value The meta value to update.
 * @param mixed $previous_value The previous meta value.
 * @return null|bool Whether to override Core's saving of metadata to the DB.
 */
function save_metadata_to_pattern_file( $override, $post_id, $meta_key, $meta_value, $previous_value ) {
	$post = get_post( $post_id );
	if ( 'pm_pattern' !== $post->post_type ) {
		return $override;
	}

	$pattern_name = $post->post_title;
	$pattern      = get_pattern_by_name( $pattern_name );
	if ( ! $pattern ) {
		return $override;
	}

	// Only update the pattern if a registered meta key is being updated here (no need for core keys like _edit_lock).
	$registered_meta_keys = array_keys( get_registered_meta_keys( 'post', 'pm_pattern' ) );
	if ( ! in_array( $meta_key, $registered_meta_keys, true ) ) {
		return $override;
	}

	if ( 'name' === $meta_key ) {
		wp_update_post(
			[
				'ID'         => $post_id,
				'post_title' => $meta_value,
			]
		);

		if ( $previous_value && $previous_value !== $meta_value ) {
			delete_pattern( $meta_value );
		}
	}

	return update_pattern(
		array_merge(
			$pattern,
			[
				$meta_key => $meta_value,
			]
		)
	);
}
add_filter( 'update_post_metadata', __NAMESPACE__ . '\save_metadata_to_pattern_file', 10, 5 );

/**
 * Gets the metadata from the pattern file, not the DB.
 *
 * @param null|mixed $override The filtered metadata, or null to get meta from the DB.
 * @param int $post_id The post ID the meta is for.
 * @param string $meta_key The meta key to get.
 * @param bool $is_single Whether the meta is single.
 * @return null|mixed The filtered meta value, or null.
 */
function get_metadata_from_pattern_file( $override, $post_id, $meta_key, $is_single ) {
	$post = get_post( $post_id );
	if ( ! $post ) {
		return $override;
	}

	if ( 'pm_pattern' !== $post->post_type ) {
		return $override;
	}

	$pattern_name = $post->post_title;

	$pattern = get_pattern_by_name( $pattern_name );
	if ( ! $pattern ) {
		return $override;
	}

	if ( isset( $pattern[ $meta_key ] ) ) {
		return $is_single ? $pattern[ $meta_key ] : [ $pattern[ $meta_key ] ];
	}

	return $override;
}
add_filter( 'get_post_metadata', __NAMESPACE__ . '\get_metadata_from_pattern_file', 10, 4 );

/**
 * Redirects for pattern actions.
 */
function redirect_pattern_actions() {
	if ( 'pm_pattern' !== filter_input( INPUT_GET, 'post_type' ) ) {
		return;
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if ( 'edit-pattern' === filter_input( INPUT_GET, 'action' ) ) {
		// Prevent the hook from overwriting the file when this post is created.
		remove_action( 'rest_after_insert_pm_pattern', __NAMESPACE__ . '\save_pattern_to_file' );
		$new_post = wp_insert_post(
			[
				'post_type'   => 'pm_pattern',
				'post_title'  => sanitize_text_field( filter_input( INPUT_GET, 'name' ) ),
				'post_status' => 'publish',
			]
		);
		add_action( 'rest_after_insert_pm_pattern', __NAMESPACE__ . '\save_pattern_to_file' );

		wp_safe_redirect(
			get_edit_post_link( $new_post, 'direct_link' )
		);
	}

	if ( 'create-new' === filter_input( INPUT_GET, 'action' ) ) {
		$new_pattern = get_new_pattern( get_theme_patterns() );

		update_pattern( $new_pattern );
		$new_post = wp_insert_post(
			[
				'post_type'   => 'pm_pattern',
				'post_title'  => $new_pattern['name'],
				'post_status' => 'publish',
			]
		);

		wp_safe_redirect(
			get_edit_post_link( $new_post, 'direct_link' )
		);
	}

	if ( 'duplicate' === filter_input( INPUT_GET, 'action' ) ) {
		$pattern_to_duplicate  = get_pattern_by_name( sanitize_text_field( filter_input( INPUT_GET, 'name' ) ) );
		$duplicate_pattern_ids = get_duplicate_pattern_ids( $pattern_to_duplicate['name'], get_theme_patterns() );
		if ( ! $duplicate_pattern_ids ) {
			return;
		}

		$new_pattern = array_merge(
			$pattern_to_duplicate,
			$duplicate_pattern_ids
		);

		update_pattern( $new_pattern );

		// Prevent the hook from overwriting the file when this post is created.
		remove_action( 'rest_after_insert_pm_pattern', __NAMESPACE__ . '\save_pattern_to_file' );
		$new_post = wp_insert_post(
			[
				'post_type'    => 'pm_pattern',
				'post_title'   => $new_pattern['name'],
				'post_status'  => 'publish',
				'post_content' => '',
			]
		);
		add_action( 'rest_after_insert_pm_pattern', __NAMESPACE__ . '\save_pattern_to_file' );

		wp_safe_redirect(
			get_edit_post_link( $new_post, 'direct_link' )
		);
	}
}
add_action( 'admin_init', __NAMESPACE__ . '\redirect_pattern_actions' );
