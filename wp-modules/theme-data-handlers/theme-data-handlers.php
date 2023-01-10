<?php
/**
 * Module Name: Theme Data Handlers
 * Description: This module contains functions for getting and saving theme data.
 * Namespace: ThemeDataHandlers
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\ThemeDataHandlers;

use WP_REST_Response;
use function switch_theme;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Get data for a single themes in the format used by Theme Manager.
 *
 * @param string $theme_slug The directory name of the theme in question.
 * @return array
 */
function get_theme( $theme_slug ) {
	$themes_data = get_the_themes();

	return $themes_data[ $theme_slug ];
}

/**
 * Get data for all of the installed themes in the format used by Theme Manager.
 *
 * @return array
 */
function get_the_themes() {
	$wpthemes = wp_get_themes();

	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$formatted_theme_data = [];

	$wpthemes = wp_get_themes();

	$file_headers = array(
		'Name'        => 'Theme Name',
		'ThemeURI'    => 'Theme URI',
		'Description' => 'Description',
		'Author'      => 'Author',
		'AuthorURI'   => 'Author URI',
		'Version'     => 'Version',
		'Template'    => 'Template',
		'Status'      => 'Status',
		'Tags'        => 'Tags',
		'TextDomain'  => 'Text Domain',
		'DomainPath'  => 'Domain Path',
		'RequiresWP'  => 'Requires at least',
		'RequiresPHP' => 'Requires PHP',
		'UpdateURI'   => 'Update URI',
	);

	foreach ( $wpthemes as $theme_slug => $theme_data ) {
		$theme_root = get_theme_root( $theme_slug );
		$theme_dir  = "$theme_root/$theme_slug";

		$theme = get_file_data( $theme_dir . '/style.css', $file_headers, 'theme' );

		/** This filter is documented in wp-includes/theme.php */
		$theme_dir = apply_filters( 'template_directory', $theme_dir, $theme_slug, $theme_root ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound

		// Create a namespace from a theme slug.
		$theme_slug_parts = explode( '-', $theme_slug );
		$namespace        = implode( '', array_map( 'ucfirst', explode( '-', $theme_slug ) ) );
		foreach ( $theme_slug_parts as $theme_slug_part ) {
			$namespace .= ucfirst( $theme_slug_part );
		}

		$theme_json = $wp_filesystem->get_contents( "$theme_dir/theme.json" );

		$theme_data = [
			'id'                => $theme_slug,
			'name'              => $theme['Name'],
			'dirname'           => $theme_slug,
			'namespace'         => $namespace,
			'uri'               => $theme['ThemeURI'],
			'author'            => $theme['Author'],
			'author_uri'        => $theme['AuthorURI'],
			'description'       => $theme['Description'],
			'tags'              => $theme['Tags'],
			'tested_up_to'      => $theme['Description'],
			'requires_wp'       => $theme['RequiresWP'],
			'requires_php'      => $theme['RequiresPHP'],
			'version'           => $theme['Version'],
			'text_domain'       => $theme['TextDomain'],
			'included_patterns' => \PatternManager\PatternDataHandlers\get_theme_patterns( $theme_dir ),
			'template_files'    => \PatternManager\PatternDataHandlers\get_theme_templates( $theme_dir ),
			'template_parts'    => \PatternManager\PatternDataHandlers\get_theme_template_parts( $theme_dir ),
			'theme_json_file'   => ! $theme_json ? [] : json_decode( $theme_json, true ),
			'styles'            => [],
		];

		$formatted_theme_data[ $theme_data['id'] ] = $theme_data;
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
		return new \WP_Error( 'no_zip_archive_class', __( 'No ZipArchive class found', 'pattern-manager' ) );
	}

	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	// Build the files for the theme, located in wp-content/themes/.
	$theme_boiler_dir = $wp_filesystem->wp_plugins_dir() . 'pattern-manager/wp-modules/theme-boiler/theme-boiler/';
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
		return new \WP_Error( 'file_not_found', __( 'Zip file not found', 'pattern-manager' ) );
	}

	$zip_url = str_replace( trailingslashit( $wp_filesystem->wp_content_dir() ), trailingslashit( WP_CONTENT_URL ), $zip_name );

	\PatternManager\Tracky\send_event(
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
 * @param bool $update_patterns Whether we should update patterns as part of this, or not. Note that when in the UI/App, patterns will save themselves after this is done, so we don't need to save patterns here, which is why this boolean option exists.
 * @return array
 */
function update_theme( $theme, $update_patterns = true ) {

	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	// Build the files for the theme, located in wp-content/themes/.
	$theme_boiler_dir = $wp_filesystem->wp_plugins_dir() . '/pattern-manager/wp-modules/theme-boiler/theme-boiler/';
	$themes_dir       = $wp_filesystem->wp_themes_dir();
	$new_theme_dir    = $themes_dir . $theme['dirname'] . '/';

	// Create the new theme directory, if it does not already exist.
	if ( ! $wp_filesystem->exists( $new_theme_dir ) ) {
		$wp_filesystem->mkdir( $new_theme_dir );
		// Copy the boiler theme into it.
		copy_dir( $theme_boiler_dir, $new_theme_dir );
	}

	// Fix strings in the stylesheet.
	\PatternManager\StringFixer\fix_theme_stylesheet_strings( $new_theme_dir . 'style.css', $theme );

	// Fix strings in the functions.php file.
	\PatternManager\StringFixer\fix_theme_functions_strings( $new_theme_dir . 'functions.php', $theme );

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
	$theme['id'] = $theme['dirname'];

	// Activate this theme.
	switch_theme( $theme['dirname'] );

	if ( isset( $theme['included_patterns'] ) ) {
		\PatternManager\PatternDataHandlers\delete_patterns_not_present( $theme['included_patterns'] );
	} else {
		$theme['included_patterns'] = \PatternManager\PatternDataHandlers\get_theme_patterns( get_template_directory() );
	}

	// Note we do not check $update_patterns here. This is because included_patterns are treated differently than template_files and template_parts, in that they are saved WITH the theme data, while template things are saved separately in the site editor.
	foreach ( $theme['included_patterns'] as $included_pattern ) {
		\PatternManager\PatternDataHandlers\update_pattern( $included_pattern );
	}

	foreach ( $theme['styles'] as $style ) {
		\PatternManager\ThemeJsonDataHandlers\update_theme_style( $style );
	}

	if ( $update_patterns ) {
		if ( ! $theme['template_files'] ) {
			$theme['template_files'] = \PatternManager\PatternDataHandlers\get_theme_templates( get_template_directory() );
		}

		foreach ( $theme['template_files'] as $template_name => $template_data ) {
			\PatternManager\PatternDataHandlers\update_pattern(
				array(
					'name'    => $template_name,
					'content' => $template_data['content'],
					'type'    => 'template',
				)
			);
		}

		if ( ! isset( $theme['template_parts'] ) ) {
			$theme['template_parts'] = \PatternManager\PatternDataHandlers\get_theme_template_parts( get_template_directory() );
		}

		foreach ( $theme['template_parts'] as $template_name => $template_data ) {
			\PatternManager\PatternDataHandlers\update_pattern(
				array(
					'name'    => $template_name,
					'content' => $template_data['content'],
					'type'    => 'template_part',
				)
			);
		}
	}

	// Now that all patterns have been saved, remove any images no longer needed in the theme.
	\PatternManager\PatternDataHandlers\tree_shake_theme_images();

	\PatternManager\Tracky\send_event(
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
