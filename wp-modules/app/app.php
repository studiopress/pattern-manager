<?php
/**
 * Module Name: App
 * Description: The browser app where the work gets done.
 * Namespace: App
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\App;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require 'includes/php/enqueue-scripts.php';
