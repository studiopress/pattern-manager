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
use function switch_theme;

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
		'styles'            => [],
	];

	foreach ( $wpthemes as $theme_slug => $theme ) {
		$theme_root = get_theme_root( $theme_slug );
		$theme_dir  = "$theme_root/$theme_slug";

		/** This filter is documented in wp-includes/theme.php */
		$theme_dir       = apply_filters( 'template_directory', $theme_dir, $theme_slug, $theme_root ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
		$theme_data_file = "$theme_dir/fsestudio-data.json";

		if ( $wp_filesystem->exists( $theme_data_file ) ) {
			$theme_data = json_decode( $wp_filesystem->get_contents( $theme_data_file ), true );
			$theme_data = wp_parse_args( $theme_data, $default_theme_data );

			$formatted_theme_data[ $theme_data['id'] ] = $theme_data;

			// Add the theme.json file data to the theme data.
			$formatted_theme_data[ $theme_data['id'] ]['theme_json_file'] = json_decode( $wp_filesystem->get_contents( "$theme_dir/theme.json" ), true );

			// Add the included Patterns for the current theme.
			$formatted_theme_data[ $theme_data['id'] ]['included_patterns'] = \FseStudio\PatternDataHandlers\get_theme_patterns( $theme_dir, $pre_existing_theme );

			// Add the template files that exist in the theme.
			$formatted_theme_data[ $theme_data['id'] ]['template_files'] = \FseStudio\PatternDataHandlers\get_theme_templates( $theme_dir, $pre_existing_theme );

			// Add the template part files that exist in the theme.
			$formatted_theme_data[ $theme_data['id'] ]['template_parts'] = \FseStudio\PatternDataHandlers\get_theme_template_parts( $theme_dir, $pre_existing_theme );
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

	$zip_url = str_replace( trailingslashit( $wp_filesystem->wp_content_dir() ), trailingslashit( WP_CONTENT_URL ), $zip_name );

	\FseStudio\Tracky\send_event(
		array(
			'action'    => 'zip_created',
			'themeName' => $theme['dirname'],
		)
	);

	return $zip_url;
}

/**
 * Update a single theme.
 *
 * @param array $theme Data about the theme.
 * @return array
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
	if ( isset( $theme['theme_json_file'] ) && ! empty( $theme['theme_json_file'] ) ) {
		$wp_filesystem->put_contents(
			$new_theme_dir . '/theme.json',
			wp_json_encode(
				$theme['theme_json_file'],
				JSON_PRETTY_PRINT
			),
			FS_CHMOD_FILE
		);
	}

	// Assign a unique ID to this theme if it doesn't already have one.
	if ( ! $theme['id'] ) {
		$theme['id'] = wp_generate_uuid4();
	}

	// Create the theme's fsestudio-data.json file.
	$wp_filesystem->put_contents(
		$new_theme_dir . 'fsestudio-data.json',
		wp_json_encode(
			$theme,
			JSON_PRETTY_PRINT
		),
		FS_CHMOD_FILE
	);

	// Activate this theme.
	switch_theme( $theme['dirname'] );

	if ( isset( $theme['included_patterns'] ) ) {
		\FseStudio\PatternDataHandlers\delete_patterns_not_present( array_keys( $theme['included_patterns'] ) );
	} else {
		$theme['included_patterns'] = \FseStudio\PatternDataHandlers\get_theme_patterns( get_template_directory() );
	}

	foreach ( $theme['included_patterns'] as $included_pattern ) {
		\FseStudio\PatternDataHandlers\update_pattern( $included_pattern );
	}

	foreach ( $theme['styles'] as $style ) {
		\FseStudio\ThemeJsonDataHandlers\update_theme_style( $style );
	}

	if ( ! $theme['template_files'] ) {
		$theme['template_files'] = \FseStudio\PatternDataHandlers\get_theme_templates( get_template_directory() );
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

	if ( ! isset( $theme['template_parts'] ) ) {
		$theme['template_parts'] = \FseStudio\PatternDataHandlers\get_theme_template_parts( get_template_directory() );
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

	\FseStudio\Tracky\send_event(
		array(
			'action'    => 'theme_saved',
			'themeName' => $theme['dirname'],
		)
	);

	return $theme;
}

/**
 * Switches to a theme.
 *
 * @param string $theme_slug The slug, or dirname, of the theme to switch to.
 */
function switch_to_theme( string $theme_slug ) {
	switch_theme( $theme_slug );
}
