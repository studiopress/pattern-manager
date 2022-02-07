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

	foreach ( $theme_json_file_paths as $path ) {
		$theme_json_file_data = array(
			'name'    => basename( $path, '.json' ),
			'content' => json_decode( $wp_filesystem->get_contents( $path ) ),
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
		$module_dir_path . '/theme-json-files/' . $theme_json_file_data['name'],
		$theme_json_file_data['content'],
		FS_CHMOD_FILE
	);

	return $success;
}
