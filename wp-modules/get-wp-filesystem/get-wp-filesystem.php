<?php
/**
 * Module Name: Get WP Filesystem
 * Description: A one-line function get the the WP Filesystem API up and running, which lets you manage files on the server.
 * Namespace: GetWpFilesystem
 *
 * @package fse-theme-manager
 */

declare(strict_types=1);

namespace FseThemeManager\GetWpFilesystem;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function module_data() {
	return [
		'dir' => plugin_dir_path( __FILE__ ),
		'url' => plugin_dir_url( __FILE__ ),
	];
}

require 'includes/php/get-wp-filesystem.php';
