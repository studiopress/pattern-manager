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
 * Save theme style variation.
 *
 * @param  array  $style  The style variation to be saved.
 * @return bool
 */
function update_theme_style( $style ) {
	$style_default = [
		'id'    => '',
		'title' => '',
		'body'  => [],
	];

	$style = wp_parse_args( $style, $style_default );

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$wp_theme_dir = get_template_directory();

	$styles_dir = $wp_theme_dir . '/styles/';
	$file_body  = get_json_formatted_style( $style );
	$file_name  = sanitize_title( $style['id'] ) . '.json'; // Use style id as filename.

	// Add the styles dir if if does not exist.
	if ( ! $wp_filesystem->exists( $styles_dir ) ) {
		$wp_filesystem->mkdir( $styles_dir );
	}

	// Write the file to disk.
	$style_file_created = $wp_filesystem->put_contents(
		$styles_dir . $file_name,
		$file_body,
		FS_CHMOD_FILE
	);

	return $style_file_created;
}

/**
 * Format the theme style variation for saving to [file].json.
 *
 * @param  array  $style  The style variation to be formatted.
 * @return string
 */
function get_json_formatted_style( $style ) {
	$style_json = [];

	// Store the id and title to the new array.
	$style_json['id']    = $style['id'];
	$style_json['title'] = $style['title'];

	// Use array_merge so the body is saved on top-level.
	$style_json = array_merge( $style_json, $style['body'] );

	// Format style variation as site-editor prefers.
	$style_json = unset_style_body_options( $style_json );

	return wp_json_encode( $style_json, JSON_PRETTY_PRINT );
}

/**
 * Unset options that expose a gutenberg bug.
 *
 * Certain options being present in the json file cause selected style to not
 * maintain selected border around style variation item in editor.
 *
 * @param  array  $style  The style variation eith options to be unset.
 * @return array
 */
function unset_style_body_options( $style ) {
	$items_to_unset = [
		'customTemplates',
		'templateParts',
		'color'      => [
			'background',
			'custom',
			'customDuotone',
			'customGradient',
			'defaultGradients',
			'defaultPalette',
			'defaultDuotone',
			'link',
		],
		'typography' => [
			'customFontSize',
			'dropCap',
			'fontStyle',
			'fontWeight',
			'letterSpacing',
			'textDecoration',
			'textTransform',
		],
	];

	foreach ( $items_to_unset as $key => $value ) {
		if ( is_array( $value ) ) {
			foreach ( $value as $inner_value ) {
				unset( $style['settings'][ $key ][ $inner_value ] );
			}
		} else {
			unset( $style[ $value ] );
		}
	}

	return $style;
}
