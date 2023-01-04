<?php
/**
 * Module Name: String Fixer
 * Description: This module contains functions for scanning directories, and ensuring strings as are they should be for themes.
 * Namespace: StringFixer
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\StringFixer;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Rename all strings in a theme's functions.php file.
 *
 * @param string $functions_file_path The path to the functions.php file in the theme in question.
 * @param array  $strings The relevant strings used to create the theme file header.
 */
function fix_theme_functions_strings( string $functions_file_path, array $strings ) {
	if ( ! $strings['namespace'] ) {
		return false;
	}

	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	if ( ! $wp_filesystem->exists( $functions_file_path ) ) {
		return false;
	}

	// Open the file.
	$file_contents = $wp_filesystem->get_contents( $functions_file_path );

	// Make sure the file header is correct.
	$file_contents = fix_theme_namespace( $file_contents, $strings['namespace'] );
	$file_contents = fix_package_tag( $file_contents, $strings['dirname'] );

	$wp_filesystem->put_contents( $functions_file_path, $file_contents );

	return true;
}

/**
 * Rewrite a Theme stylehseet file header.
 *
 * @param string $stylesheet_path The incoming contents of the file we are fixing the header of.
 * @param array  $strings The relevant strings used to create the theme file header.
 */
function fix_theme_stylesheet_strings( string $stylesheet_path, array $strings ) {
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	// Open the file.
	$file_contents = $wp_filesystem->get_contents( $stylesheet_path );

	$fixed_file_header = '/*
Theme Name: ' . $strings['name'] . '
Theme URI: ' . $strings['uri'] . '
Author: ' . $strings['author'] . '
Author URI: ' . $strings['author_uri'] . '
Description: ' . $strings['description'] . '
Tags: ' . $strings['tags'] . '
Tested up to: ' . $strings['tested_up_to'] . '
Requires PHP: ' . $strings['requires_php'] . '
Version: ' . $strings['version'] . '
License: GNU General Public License v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ' . $strings['text_domain'] . '

' . $strings['name'] . ' WordPress Theme, (C) 2022 ' . $strings['author'] . '.
' . $strings['name'] . ' is distributed under the terms of the GNU GPL.
*/';

	$pattern = '/\/\*\nTheme Name:[^*]*\*\//';

	// Find the file header.
	$match_found = preg_match_all( $pattern, $file_contents, $matches );

	// Replace it if found.
	if ( $match_found ) {
		$file_contents = str_replace( $matches[0][0], $fixed_file_header, $file_contents );
	}

	$wp_filesystem->put_contents( $stylesheet_path, $file_contents );

	return true;
}

/**
 * Rewrite the namespace definition in a file's contents to match the theme.
 *
 * @param string $file_contents The incoming contents of the file we are fixing the header of.
 * @param string $namespace The namespace to use.
 */
function fix_theme_namespace( string $file_contents, string $namespace ) {
	$pattern = '~namespace .+?(?=;|\\\\)~';
	$fixed   = 'namespace ' . $namespace;

	// Find the namespace deifition.
	$match_found = preg_match( $pattern, $file_contents, $matches );

	// Replace namespace if found.
	if ( $match_found ) {
		$file_contents = str_replace( $matches[0], $fixed, $file_contents );
	}

	return $file_contents;
}

/**
 * Rewrite a file headers "@package" tag to ensure it is correct.
 *
 * @param string $file_contents The incoming contents of the file we are fixing the header of.
 * @param string $package TThe string to use for the package tag.
 */
function fix_package_tag( string $file_contents, string $package ) {
	$fixed = '* @package ' . $package;

	$pattern = '~\* @package .*~';

	// Find the file header.
	$file_contents = preg_replace( $pattern, $fixed, $file_contents );

	return $file_contents;
}

/**
 * The default args for a theme header.
 */
function default_theme_args() {
	return array(
		'name'              => '',
		'dirname'           => '',
		'namespace'         => '',
		'uri'               => '',
		'author'            => '',
		'author_uri'        => '',
		'description'       => '',
		'tags'              => '1.0.0',
		'tested_up_to'      => '',
		'requires_wp'       => '',
		'requires_php'      => '',
		'version'           => '',
		'text_domain'       => '',
		'included_patterns' => [],
		'index.html'        => [],
		'404.html'          => [],
		'archive.html'      => [],
		'single.html'       => [],
		'page.html'         => [],
		'search.html'       => [],
	);
}
