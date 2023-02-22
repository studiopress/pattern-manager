<?php
/**
 * Module Name: Editor
 * Namespace: Editor
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\Editor;

use WP_Post;
use WP_Query;
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
	if ( get_pattern_post_type() !== $post->post_type ) {
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
	if ( get_pattern_post_type() !== $post->post_type ) {
		return;
	}

	$pattern = get_pattern_by_name( $post->post_title );
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
	remove_action( 'rest_after_insert_' . get_pattern_post_type(), __NAMESPACE__ . '\save_pattern_to_file' );

	// Removes the post content, as it should be saved in the pattern .php file.
	wp_update_post(
		[
			'ID'           => $post->ID,
			'post_content' => '',
		]
	);

	add_action( 'rest_after_insert_' . get_pattern_post_type(), __NAMESPACE__ . '\save_pattern_to_file' );
}
add_action( 'rest_after_insert_' . get_pattern_post_type(), __NAMESPACE__ . '\save_pattern_to_file' );

/**
 * Saves a meta value to the pattern file, instead of the DB.
 *
 * @param null|bool $override Whether to override Core's saving of metadata.
 * @param int $post_id The post ID.
 * @param string $meta_key The meta key to update.
 * @param mixed $meta_value The meta value to update.
 * @return null|bool Whether to override Core's saving of metadata to the DB.
 */
function save_metadata_to_pattern_file( $override, $post_id, $meta_key, $meta_value ) {
	$post = get_post( $post_id );
	if ( get_pattern_post_type() !== $post->post_type ) {
		return $override;
	}

	$pattern_name = $post->post_title;
	$pattern      = get_pattern_by_name( $pattern_name );
	if ( ! $pattern ) {
		return $override;
	}

	// Only update the pattern if a registered meta key is being updated here (no need for core keys like _edit_lock).
	$registered_meta_keys = array_keys( get_registered_meta_keys( 'post', get_pattern_post_type() ) );
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

		if ( $pattern_name !== $meta_value ) {
			delete_pattern( $pattern_name );
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
add_filter( 'update_post_metadata', __NAMESPACE__ . '\save_metadata_to_pattern_file', 10, 4 );

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

	if ( get_pattern_post_type() !== $post->post_type ) {
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
	if ( get_pattern_post_type() !== filter_input( INPUT_GET, 'post_type' ) ) {
		return;
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if ( 'edit-pattern' === filter_input( INPUT_GET, 'action' ) ) {
		$new_post = wp_insert_post(
			[
				'post_type'   => get_pattern_post_type(),
				'post_title'  => sanitize_text_field( filter_input( INPUT_GET, 'name' ) ),
				'post_status' => 'publish',
			]
		);

		wp_safe_redirect(
			get_edit_post_link( $new_post, 'direct_link' )
		);
	}

	if ( 'create-new' === filter_input( INPUT_GET, 'action' ) ) {
		$new_pattern = get_new_pattern( get_theme_patterns() );

		update_pattern( $new_pattern );
		$new_post = wp_insert_post(
			[
				'post_type'   => get_pattern_post_type(),
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

		$new_post = wp_insert_post(
			[
				'post_type'    => get_pattern_post_type(),
				'post_title'   => $new_pattern['name'],
				'post_status'  => 'publish',
				'post_content' => '',
			]
		);

		wp_safe_redirect(
			get_edit_post_link( $new_post, 'direct_link' )
		);
	}
}
add_action( 'admin_init', __NAMESPACE__ . '\redirect_pattern_actions' );

/**
 * Adds the active theme to the heartbeat response.
 *
 * @param array  $response  The Heartbeat response.
 * @param array  $data      The $_POST data sent.
 * @param string $screen_id The screen ID.
 * @return array The Heartbeat response.
 */
function add_active_theme_to_heartbeat( $response, $data, $screen_id ) {
	return get_pattern_post_type() === $screen_id
		? array_merge(
			$response,
			[ 'activeTheme' => basename( get_stylesheet_directory() ) ]
		)
		: $response;
}
add_filter( 'heartbeat_received', __NAMESPACE__ . '\add_active_theme_to_heartbeat', 10, 3 );

/**
 * Filters the fields used in post revisions.
 *
 * If the revision is for a pattern post,
 * don't restore the title of the revision,
 * as the title is where the pattern name is stored.
 *
 * @param array $fields The fields to filter.
 * @param WP_Post|array $post The post to filter for.
 * @return array The filtered fields.
 */
function ignore_title_field_in_revisions( $fields, $post ) {
	return isset( $post->post_parent ) && get_pattern_post_type() === get_post_type( $post->post_parent )
		? array_diff_key( $fields, [ 'post_title' => null ] )
		: $fields;
}
add_filter( '_wp_post_revision_fields', __NAMESPACE__ . '\ignore_title_field_in_revisions', 10, 2 );

/**
 * Gets the pm_pattern post IDs.
 *
 * @return int[]
 */
function get_pm_post_ids() {
	return ( new WP_Query(
		[
			'post_type'      => get_pattern_post_type(),
			'post_status'    => 'any',
			'fields'         => 'ids',
			'posts_per_page' => 10,
		]
	) )->posts;
}

/**
 * Deletes all pm_pattern posts.
 */
function delete_pattern_posts() {
	$post_ids = get_pm_post_ids();

	while ( ! empty( $post_ids ) ) {
		foreach ( $post_ids as $post_id ) {
			wp_delete_post( $post_id, true );
		}

		$post_ids = get_pm_post_ids();
	}
}
add_action( 'after_switch_theme', __NAMESPACE__ . '\delete_pattern_posts' );
