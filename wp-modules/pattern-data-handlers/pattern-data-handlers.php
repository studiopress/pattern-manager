<?php
/**
 * Module Name: Pattern Data Handlers
 * Description: This module contains functions for getting and saving pattern data.
 * Namespace: PatternDataHandlers
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\PatternDataHandlers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * A the data for a single pattern.
 *
 * @param string $pattern_id The name of the pattern to get.
 * @return array
 */
function get_pattern( $pattern_id ) {
	$patterns_data = get_patterns();
	if ( ! isset( $patterns_data[ $pattern_id ] ) ) {
		return false;
	}

	$pattern_data = $patterns_data[ $pattern_id ];

	// Temporarily generate a WP post with this pattern.
	$the_post_id                      = generate_pattern_post( $pattern_data );
	$pattern_data['block_editor_url'] = admin_url( 'post.php?post=' . $the_post_id . '&action=edit' );

	return $pattern_data;
}

/**
 * Get the data for all patterns available.
 *
 * @return array
 */
function get_patterns() {
	$module_dir_path = module_dir_path( __FILE__ );

	/**
	 * Scan Patterns directory and auto require all PHP files, and register them as block patterns.
	 */
	$pattern_file_paths = glob( $module_dir_path . '/pattern-files/*.php' );

	$patterns = array();

	foreach ( $pattern_file_paths as $path ) {
		$pattern_data                          = require $path;
		$pattern_data['name']                  = basename( $path, '.php' );
		$patterns[ basename( $path, '.php' ) ] = $pattern_data;
	}

	// Get the custom patterns (ones created by the user, not included in the plugin).
	$wp_filesystem  = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();
	$wp_themes_dir = $wp_filesystem->wp_themes_dir();

	$themes = glob( $wp_themes_dir . '*' );

	foreach ( $themes as $theme ) {

		// Grab all of the pattrns in this theme.
		$pattern_file_paths = glob( $theme . '/theme-patterns/*.php' );

		foreach ( $pattern_file_paths as $path ) {
			$pattern_data                          = require $path;
			$pattern_data['name']                  = basename( $path, '.php' );
			$patterns[ basename( $path, '.php' ) ] = $pattern_data;
		}
	}

	return $patterns;
}

/**
 * Get the data for all patterns in a theme.
 *
 * @param string $theme_path The path to the theme.
 * @return array
 */
function get_theme_patterns( $theme_path = false ) {

	if ( ! $theme_path ) {
		$theme_path = get_template_directory();
	}

	$module_dir_path = module_dir_path( __FILE__ );

	// Grab all of the patterns in this theme.
	$pattern_file_paths = glob( $theme_path . '/theme-patterns/*.php' );

	foreach ( $pattern_file_paths as $path ) {
		$pattern_data                          = require $path;
		$pattern_data['name']                  = basename( $path, '.php' );
		$patterns[ basename( $path, '.php' ) ] = $pattern_data;
	}

	return $patterns;
}

/**
 * Get the unique name for each pattern in a theme.
 *
 * @param string $theme_path The path to the theme.
 * @return array
 */
function get_theme_pattern_names( $theme_path = false ) {

	if ( ! $theme_path ) {
		$theme_path = get_template_directory();
	}

	$module_dir_path = module_dir_path( __FILE__ );

	// Grab all of the patterns in this theme.
	$pattern_file_paths = glob( $theme_path . '/theme-patterns/*.php' );

	$pattern_names = array();

	foreach ( $pattern_file_paths as $path ) {
		$pattern_data         = require $path;
		$pattern_data['name'] = basename( $path, '.php' );
		$pattern_names[]      = $pattern_data['name'];
	}

	return $pattern_names;
}

/**
 * Update a single pattern.
 *
 * @param array $pattern Data about the pattern.
 * @return bool
 */
function update_pattern( $pattern ) {

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$wp_theme_dir = get_template_directory();
	$plugin_dir   = $wp_filesystem->wp_plugins_dir() . 'fse-studio/';

	if ( ! isset( $pattern['type'] ) || 'default' === $pattern['type'] ) {
		$patterns_dir = $plugin_dir . 'wp-modules/pattern-data-handlers/pattern-files/';
	} else {

		$patterns_dir = $wp_theme_dir . '/theme-patterns/';

		if ( ! $wp_filesystem->exists( $patterns_dir ) ) {
			$wp_filesystem->mkdir( $patterns_dir );
		}
	}

	$file_contents = contruct_pattern_php_file_contents( $pattern, 'fse-studio' );

	// Convert the collection array into a file, and place it.
	$pattern_file_created = $wp_filesystem->put_contents(
		$patterns_dir . sanitize_title( $pattern['name'] ) . '.php',
		$file_contents,
		FS_CHMOD_FILE
	);

	return $pattern_file_created;
}

/**
 * Returns a string containing the code for a pattern file.
 *
 * @param array  $pattern Data about the pattern.
 * @param string $text_domain The text domain to use for any localization required.
 * @return bool
 */
function contruct_pattern_php_file_contents( $pattern, $text_domain ) {
	// phpcs:ignore
	$file_contents = "<?php
/**
 * Pattern: " . $pattern['title'] . "
 *
 * @package fse-studio
 */

return array(
	'type'          => '" . $pattern['type'] . "',
	'title'         => __( '" . addcslashes( $pattern['title'], '\'' ) . "', '" . $text_domain . "' ),
	'name'          => '" . $pattern['name'] . "',
	'categories'    => array( '" . implode( '\', \'', $pattern['categories'] ) . "' ),
	'viewportWidth' => " . ( $pattern['viewportWidth'] ? $pattern['viewportWidth'] : '1280' ) . ",
	'content'       => '" . prepare_content( $pattern['content'], $text_domain ) . "',
);
";
	return $file_contents;
}

/**
 * Prepare pattern html to be written into a file.
 *
 * @param string $pattern_html The pattern HTML code, generated by Gutenberg functions.
 * @param string $text_domain The text domain to use for any localization required.
 * @return bool
 */
function prepare_content( $pattern_html, $text_domain ) {
	return addcslashes( $pattern_html, '\'' );
}

/**
 * Generate a "fsestudio_pattern" post, populating the post_content with the passed-in value.
 *
 * @param array $block_pattern The data for the block pattern.
 */
function generate_pattern_post( $block_pattern ) {
	$new_post_details = array(
		'post_title'   => $block_pattern['title'],
		'post_content' => $block_pattern['content'],
		'post_type'    => 'fsestudio_pattern',
		'tags_input'   => $block_pattern['categories'],
	);

	// Insert the post into the database.
	$post_id = wp_insert_post( $new_post_details );

	update_post_meta( $post_id, 'title', $block_pattern['title'] );
	update_post_meta( $post_id, 'name', $block_pattern['name'] );
	update_post_meta( $post_id, 'type', $block_pattern['type'] );

	return $post_id;
}

/**
 * Delete all fsestudio_pattern posts.
 */
function delete_all_pattern_post_types() {
	$allposts = get_posts(
		array(
			'post_type'   => 'fsestudio_pattern',
			'numberposts' => -1,
		)
	);

	foreach ( $allposts as $eachpost ) {
		wp_delete_post( $eachpost->ID, true );
	}
}

/**
 * When an fsestudio_pattern post is saved, save it to the pattern file, and then delete the post.
 *
 * @param WP_Post $post The Post that was updated.
 */
function handle_pattern_post_save( $post ) {
	$post_id = $post->ID;

	$tags = wp_get_post_tags( $post_id );

	$tag_slugs = array();

	foreach ( $tags as $tag ) {
		$tag_slugs[] = $tag->slug;
	}

	$block_pattern_data = array(
		'type'          => get_post_meta( $post_id, 'type', true ),
		'title'         => get_post_meta( $post_id, 'title', true ),
		'name'          => get_post_meta( $post_id, 'name', true ),
		'categories'    => $tag_slugs,
		'viewportWidth' => 1280,
		'content'       => $post->post_content,
	);

	update_pattern( $block_pattern_data );
}
add_action( 'rest_after_insert_fsestudio_pattern', __NAMESPACE__ . '\handle_pattern_post_save' );
