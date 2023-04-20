<?php
/**
 * @package Test Theme
 */

// Enqueue style sheet.
function test_theme_enqueue_style_sheet() {
	wp_enqueue_style( 'test-theme', __FILE__ . '/style.css' );
}
add_action( 'wp_enqueue_scripts', 'test_theme_enqueue_style_sheet' );
