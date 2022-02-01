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

require 'includes/php/enqueue-scripts.php';
