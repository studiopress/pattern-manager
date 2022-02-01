<?php
/**
 * Module Name: App
 * Description: The browser app where the work gets done.
 * Namespace: AppTemp
 *
 * @package fse-theme-manager
 */

declare(strict_types=1);

namespace FseThemeManager\AppTemp;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

remove_action( 'init', 'FseThemeManager\App\load_app' );

require 'includes/php/enqueue-scripts.php';
