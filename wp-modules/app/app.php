<?php
/**
 * Module Name: App
 * Description: The browser app where the work gets done.
 * Namespace: App
 *
 * @package fse-theme-manager
 */

declare(strict_types=1);

namespace FseThemeManager\App;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function load_app() {
	require 'includes/php/enqueue-scripts.php';
}
add_action( 'init', __NAMESPACE__ . '\load_app' );
