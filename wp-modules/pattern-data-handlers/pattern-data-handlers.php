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
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();
	$wp_themes_dir = $wp_filesystem->wp_themes_dir();

	$themes = glob( $wp_themes_dir . '*' );

	foreach ( $themes as $theme ) {

		// Grab all of the pattrns in this theme.
		$pattern_file_paths = glob( $theme . '/theme-patterns/*.php' );

		foreach ( $pattern_file_paths as $path ) {
			$pattern_data         = require $path;
			$pattern_data['name'] = basename( $path, '.php' );

			// Temporarily generate a post in the databse that can be used to edit using the block editor normally.
			$the_post_id = generate_pattern_post( $pattern_data );

			// Add the post_id to the pattern data so it can be used.
			$pattern_data['post_id'] = $the_post_id;

			$patterns[ basename( $path, '.php' ) ] = $pattern_data;
		}
	}

	return $patterns;
}

/**
 * Get the pattern data for all patterns in a theme.
 *
 * @param string $theme_path The path to the theme.
 * @param array  $pre_existing_theme If passed, an existing post_id for the fse_studio pattern post will be used, instead of creating a new one.
 * @return array
 */
function get_theme_patterns( $theme_path = false, $pre_existing_theme = array() ) {
	if ( ! $theme_path ) {
		$theme_path = get_template_directory();
	}

	$module_dir_path = module_dir_path( __FILE__ );

	// Grab all of the patterns in this theme.
	$pattern_file_paths = glob( $theme_path . '/theme-patterns/*.php' );

	$patterns = array();

	foreach ( $pattern_file_paths as $path ) {
		$pattern_data         = require $path;
		$pattern_data['name'] = basename( $path, '.php' );
		$pattern_data['type'] = 'pattern';

		// If a post_id already exists for this pattern, use it instead of creating one.
		if ( isset( $pre_existing_theme['included_patterns'][ $pattern_data['name'] ] ) ) {
			$the_post_id = $pre_existing_theme['included_patterns'][ $pattern_data['name'] ]['post_id'];
			if ( ! $the_post_id ) {
				$the_post_id = generate_pattern_post( $pattern_data );
			}
		} else {
			// Temporarily generate a post in the databse that can be used to edit using the block editor normally.
			$the_post_id = generate_pattern_post( $pattern_data );
		}

		// Add the post_id to the pattern data so it can be used.
		$pattern_data['post_id'] = $the_post_id;

		$patterns[ basename( $path, '.php' ) ] = $pattern_data;
	}

	return $patterns;
}

/**
 * Get the data for all templates in a theme.
 *
 * @param string $theme_path The path to the theme.
 * @param array  $pre_existing_theme If passed, an existing post_id for the fse_studio pattern post will be used, instead of creating a new one.
 * @return array
 */
function get_theme_templates( $theme_path = false, $pre_existing_theme = array() ) {
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	if ( ! $theme_path ) {
		$theme_path = get_template_directory();
	}

	$module_dir_path = module_dir_path( __FILE__ );

	// Grab all of the templates in this theme.
	$pattern_file_paths = glob( $theme_path . '/templates/*.html' );

	$templates = array();

	foreach ( $pattern_file_paths as $path ) {
		$block_pattern_html = $wp_filesystem->get_contents( $path );

		$template_data = array(
			'type'    => 'template',
			// Translators: The name of the theme template in question.
			'title'   => sprintf( __( '%s Template', 'fse-studio' ), ucfirst( basename( $path, '.html' ) ) ),
			'name'    => basename( $path, '.html' ),
			'content' => $block_pattern_html,
		);

		// If a post_id already exists for this pattern, use it instead of creating one.
		if ( isset( $pre_existing_theme['template_files'][ $template_data['name'] ] ) ) {
			$the_post_id = $pre_existing_theme['template_files'][ $template_data['name'] ]['post_id'];
			if ( ! $the_post_id ) {
				$the_post_id = generate_pattern_post( $template_data );
			}
		} else {
			// Temporarily generate a post in the databse that can be used to edit using the block editor normally.
			$the_post_id = generate_pattern_post( $template_data );
		}

		$template_data['post_id'] = $the_post_id;

		$templates[ basename( $path, '.html' ) ] = $template_data;
	}

	return $templates;
}

/**
 * Get the data for all template parts in a theme.
 *
 * @param string $theme_path The path to the theme.
 * @param array  $pre_existing_theme If passed, an existing post_id for the fse_studio pattern post will be used, instead of creating a new one.
 * @return array
 */
function get_theme_template_parts( $theme_path = false, $pre_existing_theme = array() ) {
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	if ( ! $theme_path ) {
		$theme_path = get_template_directory();
	}

	$module_dir_path = module_dir_path( __FILE__ );

	// Grab all of the templates in this theme.
	$pattern_file_paths = glob( $theme_path . '/parts/*.html' );

	$templates = array();

	foreach ( $pattern_file_paths as $path ) {
		$block_pattern_html = $wp_filesystem->get_contents( $path );

		$template_data = array(
			'type'    => 'template_part',
			// Translators: The name of the theme template in question.
			'title'   => sprintf( __( '%s Template Part', 'fse-studio' ), ucfirst( basename( $path, '.html' ) ) ),
			'name'    => basename( $path, '.html' ),
			'content' => $block_pattern_html,
		);

		// If a post_id already exists for this pattern, use it instead of creating one.
		if ( isset( $pre_existing_theme['template_parts'][ $template_data['name'] ] ) ) {
			$the_post_id = $pre_existing_theme['template_parts'][ $template_data['name'] ]['post_id'];
			if ( ! $the_post_id ) {
				$the_post_id = generate_pattern_post( $template_data );
			}
		} else {
			// Temporarily generate a post in the databse that can be used to edit using the block editor normally.
			$the_post_id = generate_pattern_post( $template_data );
		}

		$template_data['post_id'] = $the_post_id;

		$templates[ basename( $path, '.html' ) ] = $template_data;
	}

	return $templates;
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

	if ( ! isset( $pattern['type'] ) || 'pattern' === $pattern['type'] ) {
		$patterns_dir  = $wp_theme_dir . '/theme-patterns/';
		$file_contents = contruct_pattern_php_file_contents( $pattern, 'fse-studio' );
		$file_name     = sanitize_title( $pattern['name'] ) . '.php';
	}

	if ( 'template' === $pattern['type'] ) {
		$patterns_dir  = $wp_theme_dir . '/templates/';
		$file_contents = contruct_template_php_file_contents( $pattern, 'fse-studio' );
		$file_name     = sanitize_title( $pattern['name'] ) . '.html';
	}

	if ( 'template_part' === $pattern['type'] ) {
		$patterns_dir  = $wp_theme_dir . '/parts/';
		$file_contents = contruct_template_php_file_contents( $pattern, 'fse-studio' );
		$file_name     = sanitize_title( $pattern['name'] ) . '.html';
	}

	if ( ! $wp_filesystem->exists( $patterns_dir ) ) {
		$wp_filesystem->mkdir( $patterns_dir );
	}

	// Convert the collection array into a file, and place it.
	$pattern_file_created = $wp_filesystem->put_contents(
		$patterns_dir . $file_name,
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
 * Returns a string containing the code for a template file.
 *
 * @param array  $pattern Data about the pattern.
 * @param string $text_domain The text domain to use for any localization required.
 * @return bool
 */
function contruct_template_php_file_contents( $pattern, $text_domain ) {
	return $pattern['content'];
}

/**
 * Prepare pattern html to be written into a file.
 *
 * @param string $pattern_html The pattern HTML code, generated by Gutenberg functions.
 * @param string $text_domain The text domain to use for any localization required.
 * @return bool
 */
function prepare_content( $pattern_html, $text_domain ) {
	$pattern_html = addcslashes( $pattern_html, '\'' );
	// phpcs:ignore
	// $pattern_html = move_block_assets_to_theme( $pattern_html );
	return $pattern_html;
}

/**
 * Scan blocks for images and other files, and move them into the theme as assets.
 *
 * @param string $pattern_html The pattern HTML code, generated by Gutenberg functions.
 * @return $string The modified block HTML with absolute URLs changed to be localized to the theme.
 */
function move_block_assets_to_theme( $pattern_html ) {

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$wp_theme_dir        = get_template_directory();
	$backedup_assets_dir = $wp_filesystem->wp_content_dir() . '/temp-assets/';
	$assets_dir          = $wp_theme_dir . '/assets/';

	$wp_theme_url        = get_template_directory_uri();
	$backedup_assets_url = content_url() . '/temp-assets/';
	$assets_url          = $wp_theme_url . '/assets/';

	if ( ! $wp_filesystem->exists( $backedup_assets_dir ) ) {
		$wp_filesystem->mkdir( $backedup_assets_dir );
	}

	// Before we take any action, back up the current assets directory.
	copy_dir( $assets_dir, $backedup_assets_dir );

	// Delete the assets directory so we know it only contains what is needed.
	$wp_filesystem->delete( $assets_dir, true, 'd' );

	if ( ! $wp_filesystem->exists( $assets_dir ) ) {
		$wp_filesystem->mkdir( $assets_dir );
	}

	// Find all URLs in the block pattern html.
	preg_match_all( '/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:;\/~+#-]*[\w@?^=%&\/~+#-])/', $pattern_html, $output_array );
	$urls_found = $output_array[0];

	// Loop through each URL found.
	foreach ( $urls_found as $url_found ) {

		// If looking in the theme assets directory, look in the backed up one.
		$url_found = str_replace( $assets_url, $backedup_assets_url, $url_found );

		$url_details = wp_remote_get(
			$url_found,
			array(
				'sslverify' => false,
			)
		);

		$response = wp_remote_retrieve_response_code( $url_details );

		if ( 200 !== absint( $response ) ) {
			continue;
		}

		$type = wp_remote_retrieve_header( $url_details, 'Content-Type' );

		$file_contents = wp_remote_retrieve_body( wp_remote_get( $url_found ) );
		$filename      = wp_generate_uuid4();

		if ( 'image/png' === $type ) {
			$filename = $filename . '.png';
		}

		// Save this to the theme.
		$file_saved = $wp_filesystem->put_contents(
			$wp_theme_dir . '/assets/' . $filename,
			$file_contents,
			FS_CHMOD_FILE
		);

		// Replace the URL with the one we just added to the theme.
		$pattern_html = str_replace( $url_found, "' . get_template_directory_uri() . '/assets/$filename", $pattern_html );
	}

	return $pattern_html;
}


/**
 * Generate a "fsestudio_pattern" post, populating the post_content with the passed-in value.
 *
 * @param array $block_pattern The data for the block pattern.
 */
function generate_pattern_post( $block_pattern ) {
	$title = isset( $block_pattern['title'] ) ? $block_pattern['title'] : $block_pattern['name'];

	$new_post_details = array(
		'post_title'   => $title,
		'post_content' => $block_pattern['content'],
		'post_type'    => 'fsestudio_pattern',
		'tags_input'   => isset( $block_pattern['categories'] ) ? $block_pattern['categories'] : false,
	);

	// Insert the post into the database.
	$post_id = wp_insert_post( $new_post_details );

	update_post_meta( $post_id, 'title', $title );
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
			'post_status' => array( 'publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash' ),
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

/**
 * When a wp_template post is saved, save it to the theme file.
 *
 * @param WP_Post         $post The Post that was updated.
 * @param WP_REST_Request $request The Post that was updated.
 * @param bool            $creating True when creating a post, false when updating.
 */
function handle_wp_template_save( $post, $request, $creating ) {
	if ( ! $request->get_param( 'id' ) ) {
		return;
	}

	$template_name    = explode( '//', $request->get_param( 'id' ) )[1];
	$template_content = $request->get_param( 'content' );

	$block_pattern_data = array(
		'type'          => 'template',
		'title'         => $template_name,
		'name'          => $template_name,
		'categories'    => array(),
		'viewportWidth' => 1280,
		'content'       => $template_content,
	);

	update_pattern( $block_pattern_data );
}
add_action( 'rest_after_insert_wp_template', __NAMESPACE__ . '\handle_wp_template_save', 10, 3 );


/**
 * When a wp_template_part post is saved, save it to the theme file.
 *
 * @param WP_Post         $post The Post that was updated.
 * @param WP_REST_Request $request The Post that was updated.
 * @param bool            $creating True when creating a post, false when updating.
 */
function handle_wp_template_part_save( $post, $request, $creating ) {
	$template_name    = explode( '//', $request->get_param( 'id' ) )[1];
	$template_content = $request->get_param( 'content' );

	$block_pattern_data = array(
		'type'          => 'template_part',
		'title'         => $template_name,
		'name'          => $template_name,
		'categories'    => array(),
		'viewportWidth' => 1280,
		'content'       => $template_content,
	);

	update_pattern( $block_pattern_data );
}
add_action( 'rest_after_insert_wp_template_part', __NAMESPACE__ . '\handle_wp_template_part_save', 10, 3 );
