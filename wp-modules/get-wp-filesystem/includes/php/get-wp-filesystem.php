<?php
/**
 * A function which allows you to get the WP Filesystem.
 *
 * @package fse-theme-manager
 */

declare(strict_types=1);

namespace FseThemeManager\GetWpFilesystem;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the WP Filesystem API up and running.
 *
 * @return WP_Filesystem
 */
function get_wp_filesystem_api() {

	// Set up the WP Filesystem API.
	global $wp_filesystem;

	// Get the WP Filesystem API going.
	if ( ! function_exists( 'request_filesystem_credentials' ) ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
	}

	if ( false === ( $creds = request_filesystem_credentials( admin_url(), '', false, false, null ) ) ) { // phpcs:ignore
		return false;
	}

	if ( ! WP_Filesystem( $creds ) ) {
		request_filesystem_credentials( null, '', true, false, null );
		return;
	}

	return $wp_filesystem;
}
