<?php
/**
 * Module Name: Get WP Filesystem
 * Description: A one-line function get the the WP Filesystem API up and running, which lets you manage files on the server.
 * Namespace: GetWpFilesystem
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\GetWpFilesystem;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Gets the module data.
 *
 * @return array
 */
function module_data() {
	return [
		'dir' => plugin_dir_path( __FILE__ ),
		'url' => plugin_dir_url( __FILE__ ),
	];
}

require 'includes/php/get-wp-filesystem.php';
