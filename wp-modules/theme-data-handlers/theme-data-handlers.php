<?php
/**
 * Module Name: Theme Data Handlers
 * Description: This module contains functions for getting and saving theme data.
 * Namespace: ThemeDataHandlers
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\ThemeDataHandlers;

use WP_REST_Response;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get data for a single themes in the format used by FSE Theme Manager.
 *
 * @param string $theme_id The directory name of the theme in question.
 * @param array  $pre_existing_theme If passed, an existing post_id for the fse_studio pattern post will be used, instead of creating a new one.
 * @return array
 */
function get_theme( $theme_id, $pre_existing_theme = array() ) {
	$themes_data = get_the_themes( $pre_existing_theme );

	return $themes_data[ $theme_id ];
}

/**
 * Get data for all of the installed themes in the format used by FSE Theme Manager.
 *
 * @param array $pre_existing_theme If passed, an existing post_id for the fse_studio pattern post will be used, instead of creating a new one.
 * @return array
 */
function get_the_themes( $pre_existing_theme = array() ) {
	$wpthemes = wp_get_themes();

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$formatted_theme_data = [];

	$default_theme_data = [
		'name'              => '',
		'dirname'           => '',
		'namespace'         => '',
		'uri'               => '',
		'author'            => '',
		'author_uri'        => '',
		'description'       => '',
		'tags'              => [],
		'tested_up_to'      => '',
		'requires_wp'       => '',
		'requires_php'      => '',
		'version'           => '1.0.0',
		'text_domain'       => '',
		'included_patterns' => [],
		'template_files'    => [],
		'theme_json_file'   => [],
	];

	foreach ( $wpthemes as $theme_slug => $theme ) {
		$theme_data_file = $theme->get_template_directory() . '/fsestudio-data.json';

		if ( $wp_filesystem->exists( $theme_data_file ) ) {
			$theme_data = json_decode( $wp_filesystem->get_contents( $theme_data_file ), true );
			$theme_data = wp_parse_args( $theme_data, $default_theme_data );

			$formatted_theme_data[ $theme_slug ] = $theme_data;

			// Add the theme.json file data to the theme data.
			$formatted_theme_data[ $theme_slug ]['theme_json_file'] = json_decode( $wp_filesystem->get_contents( $theme->get_template_directory() . '/theme.json' ), true );

			// Add the included Patterns for the current theme.
			if ( ! empty( $pre_existing_theme ) ) {
				$formatted_theme_data[ $theme_slug ]['included_patterns'] = \FseStudio\PatternDataHandlers\get_theme_patterns( get_template_directory(), $pre_existing_theme );

				// Add the template files that exist in the theme.
				$formatted_theme_data[ $theme_slug ]['template_files'] = \FseStudio\PatternDataHandlers\get_theme_templates( get_template_directory(), $pre_existing_theme );

				// Add the template part files that exist in the theme.
				$formatted_theme_data[ $theme_slug ]['template_parts'] = \FseStudio\PatternDataHandlers\get_theme_template_parts( get_template_directory(), $pre_existing_theme );
			} else {
				$formatted_theme_data[ $theme_slug ]['included_patterns'] = \FseStudio\PatternDataHandlers\get_theme_patterns( get_template_directory() );

				// Add the template files that exist in the theme.
				$formatted_theme_data[ $theme_slug ]['template_files'] = \FseStudio\PatternDataHandlers\get_theme_templates( get_template_directory() );

				// Add the template part files that exist in the theme.
				$formatted_theme_data[ $theme_slug ]['template_parts'] = \FseStudio\PatternDataHandlers\get_theme_template_parts( get_template_directory() );
			}
		}
	}

	return $formatted_theme_data;
}

/**
 * Export a zip of the theme.
 *
 * @param array $theme Data about the theme.
 * @return WP_Error|string
 */
function export_theme( $theme ) {
	if ( ! class_exists( 'ZipArchive' ) ) {
		return new \WP_Error( 'no_zip_archive_class', __( 'No ZipArchive class found', 'fse-studio' ) );
	}

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	// Build the files for the theme, located in wp-content/themes/.
	$theme_boiler_dir = $wp_filesystem->wp_plugins_dir() . 'fse-studio/wp-modules/theme-boiler/theme-boiler/';
	$themes_dir       = $wp_filesystem->wp_themes_dir();
	$new_theme_dir    = $themes_dir . trailingslashit( $theme['dirname'] );

	$files = list_files( $new_theme_dir );

	$zip      = new \ZipArchive();
	$zip_name = $theme_boiler_dir . $theme['dirname'] . '.zip';
	$zip->open( $zip_name, \ZipArchive::CREATE );
	foreach ( $files as $file ) {
		$file_in_the_zip = str_replace( $new_theme_dir, './', $file );
		if ( is_file( $file ) ) {
			$zip->addFile( $file, $file_in_the_zip );
		}

		if ( is_dir( $file ) ) {
			$zip->addEmptyDir( $file_in_the_zip );
		}
	}

	$zip->close();

	if ( ! is_file( $zip_name ) ) {
		return new \WP_Error( 'file_not_found', __( 'Zip file not found', 'fse-studio' ) );
	}

	$zip_url = str_replace( WP_CONTENT_DIR, WP_CONTENT_URL, $zip_name );

	return $zip_url;
}

/**
 * Update a single theme.
 *
 * @param array $theme Data about the theme.
 * @return bool
 */
function update_theme( $theme ) {

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	// Build the files for the theme, located in wp-content/themes/.
	$theme_boiler_dir = $wp_filesystem->wp_plugins_dir() . '/fse-studio/wp-modules/theme-boiler/theme-boiler/';
	$themes_dir       = $wp_filesystem->wp_themes_dir();
	$new_theme_dir    = $themes_dir . $theme['dirname'] . '/';

	// Create the new theme directory, if it does not already exist.
	if ( ! $wp_filesystem->exists( $new_theme_dir ) ) {
		$wp_filesystem->mkdir( $new_theme_dir );
		// Copy the boiler theme into it.
		copy_dir( $theme_boiler_dir, $new_theme_dir );
	}

	// Fix strings in the stylesheet.
	$strings_fixed = \FseStudio\StringFixer\fix_theme_stylesheet_strings( $new_theme_dir . 'style.css', $theme );

	// Fix strings in the functions.php file.
	$strings_fixed = \FseStudio\StringFixer\fix_theme_functions_strings( $new_theme_dir . 'functions.php', $theme );

	// Put the contents of the theme.json file into the theme.
	$wp_filesystem->put_contents(
		$new_theme_dir . '/theme.json',
		wp_json_encode(
			$theme['theme_json_file'],
			JSON_PRETTY_PRINT
		),
		FS_CHMOD_FILE
	);

	// Remove the theme json data from the theme array because it's already saved to theme.json.
	unset( $theme['theme_json_file'] );

	// Create the theme's fsestudio-data.json file.
	$success = $wp_filesystem->put_contents(
		$new_theme_dir . 'fsestudio-data.json',
		wp_json_encode(
			$theme,
			JSON_PRETTY_PRINT
		),
		FS_CHMOD_FILE
	);

	// Delete the current templates directory if it exists.
	$wp_filesystem->delete( $new_theme_dir . '/templates', true );
	$wp_filesystem->mkdir( $new_theme_dir . '/templates' );

	foreach ( $theme['included_patterns'] as $included_pattern ) {
		\FseStudio\PatternDataHandlers\update_pattern( $included_pattern );
	}

	foreach ( $theme['template_files'] as $template_name => $template_data ) {
		\FseStudio\PatternDataHandlers\update_pattern(
			array(
				'name'    => $template_name,
				'content' => $template_data['content'],
				'type'    => 'template',
			)
		);
	}

	foreach ( $theme['template_parts'] as $template_name => $template_data ) {
		\FseStudio\PatternDataHandlers\update_pattern(
			array(
				'name'    => $template_name,
				'content' => $template_data['content'],
				'type'    => 'template_part',
			)
		);
	}

	// Activate this theme.
	switch_theme( $theme['dirname'] );

	return \FseStudio\ThemeDataHandlers\get_theme( $theme['dirname'], $theme );
}
