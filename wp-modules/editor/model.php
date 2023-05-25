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
use function PatternManager\GetWpFilesystem\get_wp_filesystem_api;
use function PatternManager\PatternDataHandlers\get_pattern_by_name;
use function PatternManager\PatternDataHandlers\get_pattern_defaults;
use function PatternManager\PatternDataHandlers\get_theme_patterns;
use function PatternManager\PatternDataHandlers\delete_pattern;
use function PatternManager\PatternDataHandlers\tree_shake_theme_images;
use function PatternManager\PatternDataHandlers\update_pattern;

/**
 * Gets the pattern content and title from the PHP file.
 *
 * @param WP_Post $post The post to possibly add content to.
 */
function populate_pattern_from_file( $post ) {
	if ( get_pattern_post_type() !== $post->post_type ) {
		return;
	}

	if ( ! $post->post_name ) {
		return;
	}

	$pattern = get_pattern_by_name( $post->post_name );
	if ( ! $pattern ) {
		return;
	}

	$post->post_content = $pattern['content'];
	$post->post_title   = $pattern['title'];
}
add_action( 'the_post', __NAMESPACE__ . '\populate_pattern_from_file' );

/**
 * Saves the pattern to the .php file, and also removes the mocked post required for the WP editing UI.
 *
 * @param int $post_id The post ID.
 * @param WP_Post $post The post.
 */
function save_pattern_to_file( WP_Post $post ) {
	if ( get_pattern_post_type() !== $post->post_type ) {
		return;
	}

	$name    = $post->post_name;
	$pattern = get_pattern_by_name( $name );
	update_pattern(
		array_merge(
			// Only set the slug to the name for new patterns.
			// Patterns created without PM might have a different slug and name.
			$pattern ? $pattern : [ 'slug' => prepend_textdomain( $name ) ],
			[
				'content' => $post->post_content,
				'name'    => $name,
			],
			$post->post_title
				? [ 'title' => $post->post_title ]
				: []
		)
	);

	// Remove pattern data from the post, as it was written to the pattern .php file.
	wp_update_post(
		[
			'ID'           => $post->ID,
			'post_title'   => '',
			'post_content' => '',
		]
	);

	tree_shake_theme_images( get_wp_filesystem_api(), 'copy_dir' );
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

	if ( ! isset( $post->post_type ) ) {
		return $override;
	}

	if ( get_pattern_post_type() !== $post->post_type ) {
		return $override;
	}

	// Only update the pattern if a registered meta key is being updated here (no need for core keys like _edit_lock).
	$registered_meta_keys = array_keys( get_registered_meta_keys( 'post', get_pattern_post_type() ) );
	if ( ! in_array( $meta_key, $registered_meta_keys, true ) ) {
		return $override;
	}

	if ( 'name' === $meta_key && ! $meta_value ) {
		return $override;
	}

	$pattern_name = $post->post_name;
	$pattern      = get_pattern_by_name( $pattern_name );
	$name_changed = 'name' === $meta_key && $pattern_name !== $meta_value;

	if ( 'name' === $meta_key ) {
		wp_update_post(
			[
				'ID'        => $post_id,
				'post_name' => $meta_value,
			]
		);
	}

	$slug = prepend_textdomain( $name_changed ? $meta_value : $pattern_name );

	if ( $name_changed ) {
		delete_pattern( $pattern_name );
		update_pattern_slugs( $pattern['slug'], $slug );
	}

	return update_pattern(
		array_merge(
			get_pattern_defaults(),
			$pattern ? $pattern : [
				'title' => $post->post_title,
				'slug'  => $slug,
			],
			$name_changed ? [ 'slug' => $slug ] : [],
			[
				'name'    => $pattern_name,
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
	if ( ! $post || get_pattern_post_type() !== $post->post_type ) {
		return $override;
	}

	$pattern = get_pattern_by_name( $post->post_name );
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

	if ( 'duplicate' === filter_input( INPUT_GET, 'action' ) ) {
		duplicate_pattern( filter_input( INPUT_GET, 'name' ) );
	}

	if ( 'edit-pattern' === filter_input( INPUT_GET, 'action' ) ) {
		edit_pattern( filter_input( INPUT_GET, 'name' ) );
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

/**
 * Gets the title for a new pattern post.
 *
 * For posts of type 'post', it's fine if the title is empty.
 * But the title of a pattern is important,
 * as the file name is a slug of that title.
 * And it must be unique.
 *
 * @param string $post_title The post title.
 * @param WP_Post $post The post.
 * @return string
 */
function get_default_title( $post_title, $post ) {
	return isset( $post->post_type ) && get_pattern_post_type() === $post->post_type
		? get_new_pattern_title( get_theme_patterns() )
		: $post_title;
}
add_filter( 'default_title', __NAMESPACE__ . '\get_default_title', 10, 2 );

/**
 * Prevents WP from giving a longer ->post_name to a pattern.
 *
 * On renaming a pattern, sometimes WP adds a number
 * to the ->post_name in order to be unique.
 * It can change 'example-pattern' to 'example-pattern-1'.
 * The ->post_name is where we store the pattern name.
 * So it needs to be in sync with the ->post_title.
 * It can't be 'example-pattern-1' if the title is 'Example Pattern'.
 *
 * @param string $slug          The post slug.
 * @param int    $post_ID       Post ID.
 * @param string $post_status   The post status.
 * @param string $post_type     Post type.
 * @param int    $post_parent   Post parent ID.
 * @param string $original_slug The original post slug.
 * @return string The slug.
 */
function short_circuit_unique_slug( $slug, $post_ID, $post_status, $post_type, $post_parent, $original_slug ) {
	return get_pattern_post_type() === $post_type
		? $original_slug
		: $slug;
}
add_filter( 'wp_unique_post_slug', __NAMESPACE__ . '\short_circuit_unique_slug', 10, 6 );
