<?php
/**
 * A function which allows you to get the WP Filesystem.
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\GetWpFilesystem;

use WP_Filesystem_Base;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the WP Filesystem API up and running.
 *
 * @return WP_Filesystem_Base|false
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
		return false;
	}

	return $wp_filesystem;
}
