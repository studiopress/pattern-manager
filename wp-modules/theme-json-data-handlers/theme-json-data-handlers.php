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

	$wp_head_and_wp_footer = get_wp_head_and_wp_footer();

	/**
	 * Scan theme-json-files directory and get all the default theme.json files.
	 */
	$theme_json_file_paths = glob( $module_dir_path . '/theme-json-files/*.json' );

	$theme_json_files = array();

	foreach ( $theme_json_file_paths as $path ) {
		$theme_json_files[ basename( $path, '.json' ) ] = json_decode( $wp_filesystem->get_contents( $path ), true );
	}

	/**
	 * Scan each theme to get all theme.json files.
	 */
	$wp_filesystem  = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();
	$wp_themes_dir = $wp_filesystem->wp_themes_dir();

	$themes = glob( $wp_themes_dir . '*' );

	foreach ( $themes as $theme ) {
		if ( $wp_filesystem->exists( $theme . '/theme.json' ) ) {
			$theme_json_files[ basename( $theme ) ] = json_decode( $wp_filesystem->get_contents( $theme . '/theme.json' ), true );
		}
	}

	return $theme_json_files;
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
