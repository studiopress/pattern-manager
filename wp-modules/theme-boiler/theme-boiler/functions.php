<?php
/**
 * This file adds functions to the Boiler theme for WordPress.
 *
 * @package fse-studio
 * @author  WP Engine
 * @license GNU General Public License v2 or later
 * @link    https://boilerwp.com/
 */

namespace FseStudio\ThemeBoiler;

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 *
 * @return void
 */
function setup() {

	// Make theme available for translation.
	load_theme_textdomain( sanitize_title( __NAMESPACE__ ), get_template_directory() . '/languages' );

	// Add support for Block Styles.
	add_theme_support( 'wp-block-styles' );

	// Add support for editor styles.
	add_theme_support( 'editor-styles' );

	// Enqueue editor styles and fonts.
	add_editor_style(
		array(
			'./style.css',
			get_fonts_url(),
		)
	);

	// Remove core block patterns.
	remove_theme_support( 'core-block-patterns' );
}
add_action( 'after_setup_theme', __NAMESPACE__ . '\setup' );

/**
 * Enqueue style sheet.
 *
 * @return void
 */
function enqueue_style_sheet() {
	wp_enqueue_style( sanitize_title( __NAMESPACE__ ), get_template_directory_uri() . '/style.css', array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_style_sheet' );

/**
 * Enqueue fonts.
 *
 * @return void
 */
function enqueue_fonts() {
	wp_enqueue_style( sanitize_title( __NAMESPACE__ ) . '-fonts', get_fonts_url(), array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_fonts' );

/**
 * Gets the font URL from Google Fonts.
 *
 * @return string
 */
function get_fonts_url() {
	$fonts = array(
		'family=Jost:wght@100;200;300;400;500;600;700;800;900',
		'family=Outfit:wght@100;200;300;400;500;600;700;800;900',
	);

	// Make a single request for all Google Fonts.
	return esc_url_raw( 'https://fonts.googleapis.com/css2?' . implode( '&', array_unique( $fonts ) ) . '&display=swap' );
}

/**
 * Register the included block patterns.
 *
 * @return void
 */
function register_block_patterns() {
	/**
	 * Scan Patterns directory and auto require all PHP files, and register them as block patterns.
	 */
	$pattern_file_paths = glob( dirname( __FILE__ ) . '/theme-patterns/*.php' );

	foreach ( $pattern_file_paths as $path ) {
		register_block_pattern(
			sanitize_title( __NAMESPACE__ ) . '/' . basename( $path, '.php' ),
			require $path
		);
	}
}
add_action( 'init', __NAMESPACE__ . '\register_block_patterns', 9 );
