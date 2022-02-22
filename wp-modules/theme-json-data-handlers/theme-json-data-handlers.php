<?php
/**
 * Module Name: Theme JSON Data Handlers
 * Description: This module contains functions for getting and saving theme JSON file data.
 * Namespace: ThemeJsonDataHandlers
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\ThemeJsonDataHandlers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get data for a single themes in the format used by FSE Theme Manager.
 *
 * @param string $id The directory name of the theme in question.
 * @return array
 */
function get_theme_json_file( $id ) {
	$theme_json_files = get_all_theme_json_files();
	return $theme_json_files[ $id ];
}

/**
 * Get data for all of the installed themes in the format used by FSE Theme Manager.
 *
 * @return array
 */
function get_all_theme_json_files() {

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$module_dir_path = module_dir_path( __FILE__ );

	/**
	 * Scan theme-json-files directory and get all the theme.json files.
	 */
	$theme_json_file_paths = glob( $module_dir_path . '/theme-json-files/*.json' );

	$theme_json_files = array();

	$wp_head_and_wp_footer = get_wp_head_and_wp_footer();

	foreach ( $theme_json_file_paths as $path ) {
		$theme_json_content   = json_decode( $wp_filesystem->get_contents( $path ), true );
		$theme_json_file_data = array(
			'name'                 => basename( $path, '.json' ),
			'content'              => $theme_json_content,
			'renderedGlobalStyles' => ( new \WP_Theme_JSON( $theme_json_content, 'custom' ) )->get_stylesheet(),
			'patternPreviewParts'  => $wp_head_and_wp_footer,
		);

		$theme_json_files[ $theme_json_file_data['name'] ] = $theme_json_file_data;
	}

	return $theme_json_files;
}

/**
 * Update a single theme json file.
 *
 * @param array $theme_json_file_data Data about the theme json file.
 * @return bool
 */
function update_theme_json_file( $theme_json_file_data ) {

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$module_dir_path = module_dir_path( __FILE__ );

	// Create the index.html block template file.
	$success = $wp_filesystem->put_contents(
		$module_dir_path . '/theme-json-files/' . $theme_json_file_data['name'] . '.json',
		wp_json_encode( $theme_json_file_data['content'], JSON_PRETTY_PRINT ),
		FS_CHMOD_FILE
	);

	return $success;
}

/**
 * Run a string of HTML through the_content filters. This makes it so everything needed will be rendered in wp_footer.
 *
 * @param string $content The html content to run through the filters.
 * @return bool
 */
function do_the_content_things( $content ) {

	// Run through the actions that are typically taken on the_content.
	$content = do_blocks( $content );
	$content = wptexturize( $content );
	$content = convert_smilies( $content );
	$content = shortcode_unautop( $content );
	$content = wp_filter_content_tags( $content );
	$content = do_shortcode( $content );

	// Handle embeds for block template parts.
	global $wp_embed;
	$content = $wp_embed->autoembed( $content );

	return $content;
}

/**
 * Run all pattern HTML through the_content filters, and return wp_head and wp_footer html.
 *
 * @return bool
 */
function get_wp_head_and_wp_footer() {
	global $fsestudio_api_get_theme_json_file;

	if ( ! $fsestudio_api_get_theme_json_file ) {
		return;
	}

	// Should probably just activate the current theme beiing worked on right here so all fonts/assets/other are also rendered on the frontend properly.
	$all_patterns = \FseStudio\PatternDataHandlers\get_patterns();

	$rendered_patterns = array();

	// Get the PHP rendered version of each block.
	foreach ( $all_patterns as $pattern ) {
		$rendered_patterns[ $pattern['name'] ] = do_the_content_things( $pattern['content'] );
	}

	ob_start();
	wp_head();
	$wp_head = ob_get_clean();

	ob_start();
	wp_footer();
	$wp_footer = ob_get_clean();

	return array(
		'wp_head'          => $wp_head,
		'wp_footer'        => $wp_footer,
		'renderedPatterns' => $rendered_patterns,
	);
}
