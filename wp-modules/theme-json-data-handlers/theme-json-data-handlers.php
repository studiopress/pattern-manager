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

function update_theme_style( $style ) {

	$style_default = array(
		'id'	=> '',
		'body' 	=> [],
	);

	$style = wp_parse_args( $style, $style_default );

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$wp_theme_dir = get_template_directory();

	if ( ! isset( $style['styles'] ) ) {
		$styles_dir = $wp_theme_dir . '/styles/';
		$style_body = json_encode( $style, JSON_PRETTY_PRINT );
		$file_name  = sanitize_title( $style['id'] ) . '.php';
	}

	if ( ! $wp_filesystem->exists( $styles_dir ) ) {
		$wp_filesystem->mkdir( $styles_dir );
	}

	$style_file_created = $wp_filesystem->put_contents(
		$styles_dir . $file_name,
		$style_body,
		FS_CHMOD_FILE
	);

	return $style_file_created;
}
