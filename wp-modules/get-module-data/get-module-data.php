<?php
/**
 * Module Name: Get Module Data
 * Description: This module contains functions to help you get data about another module.
 *
 * @package pattern-manager
 */

declare(strict_types=1);

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'module_dir_path' ) ) {
	/**
	 * Get a module's path
	 *
	 * @param string $file_path The path to the file which is requesting the module path.
	 * @return string
	 */
	function module_dir_path( string $file_path ) { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals
		preg_match_all( '/.+?(?=wp-modules(\/|\\\)+)wp-modules(\/|\\\).+?(?=(\/|\\\))(\/|\\\)/', $file_path, $output_array );
		return trailingslashit( str_replace( '\\', '/', $output_array[0][0] ) );
	}
}

if ( ! function_exists( 'module_dir_url' ) ) {
	/**
	 * Get a module's url
	 *
	 * @param string $file_path The path to the file which is requesting the module path.
	 * @return string
	 */
	function module_dir_url( string $file_path ) { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals
		preg_match_all( '~(?<=plugins(\/|\\\)).+?(?=wp-modules)wp-modules(\/|\\\).+?(?=(\/|\\\))(\/|\\\)~', $file_path, $output_array );
		return plugins_url( $output_array[0][0] );
	}
}
