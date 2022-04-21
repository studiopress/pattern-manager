<?php
/**
 * Module Name: Pattern Post Type
 * Description: This module registers a post type to be used when editing block patterns, and sets up how things work in the block editor.
 * Namespace: StringFixer
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\PatternPostType;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Create a custom post type to be used for our default post.
 */
function pattern_post_type() {
	register_post_type(
		'fsestudio_pattern',
		array(
			'public'       => false,
			'has_archive'  => false,
			'show_ui'      => true,
			'show_in_menu' => false,
			'show_in_rest' => true,
			'taxonomies'   => array( 'post_tag' ),
			'supports'     => array(
				'editor',
				'custom-fields',
			),
			'labels'       => array(
				'name' => __( 'Pattern', 'fse-studio' ),
			),
		)
	);

	register_post_meta(
		'fsestudio_pattern',
		'type',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
		)
	);

	register_post_meta(
		'fsestudio_pattern',
		'title',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
		)
	);

	register_post_meta(
		'fsestudio_pattern',
		'name',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\pattern_post_type' );

/**
 * Add style and metaboxes to fse_pattern posts when editing.
 */
function enqueue_meta_fields_in_editor() {
	if ( 'fsestudio_pattern' !== get_post_type() ) {
		return;
	}

	$module_dir_path = module_dir_path( __FILE__ );
	$module_dir_url  = module_dir_url( __FILE__ );

	if ( file_exists( $module_dir_path . 'js/build/index.asset.php' ) ) {
		$dependencies = require $module_dir_path . 'js/build/index.asset.php';
		$dependencies = $dependencies['dependencies'];
	} else {
		return;
	}

	// Include the js on the block editor page for the fsestudio_pattern post type.
	$js_url = $module_dir_url . 'js/build/index.js';
	$js_ver = filemtime( $module_dir_path . 'js/build/index.js' );
	wp_enqueue_script( 'fsestudio_post_meta', $js_url, $dependencies, $js_ver, true );

	// Enqueue styles, combined automatically using PostCSS in wp-scripts.
	$css_url = $module_dir_url . 'js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'js/build/index.css' );
	wp_enqueue_style( 'fsestudio_post_meta_style', $css_url, array(), $css_ver );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_meta_fields_in_editor' );

/**
 * If we are on the fse-studio app page, register the patterns with WP.
 *
 * @return void
 */
function register_block_patterns() {
	$current_screen = get_current_screen();

	if ( 'fsestudio_pattern' !== $current_screen->post_type ) {
		return;
	}

	$patterns = \FseStudio\PatternDataHandlers\get_patterns();

	foreach ( $patterns as $pattern ) {
		foreach ( $pattern['categories'] as $category ) {
			register_block_pattern_category( $category, array( 'label' => ucwords( str_replace( '-', ' ', $category ) ) ) );
		}
		register_block_pattern(
			$pattern['name'],
			$pattern,
		);
	}
}
add_action( 'current_screen', __NAMESPACE__ . '\register_block_patterns', 9 );

/**
 * Modify certain words when editing a pattern.
 *
 * @param string $translation The translated or modified string.
 * @param string $text The original text we'll change.
 * @param string $domain The text domain of the string in question.
 * @return string
 */
function modify_terms( string $translation, string $text, string $domain ) {
	if ( 'Tags' === $translation ) {	
		echo $translation;
		die();
		return 'Pattern Categories';
	}

	return $translation;
}
add_filter( 'gettext', __NAMESPACE__ . '\modify_terms', 10, 3 );

/**
 * Modify certain words when editing a pattern.
 *
 * @param string $translation The translated or modified string.
 * @param string $text The original text we'll change.
 * @param string $domain The text domain of the string in question.
 * @return string
 */
function sgsdgsdg( $labels ) {
	$labels->singular_name = 'Pattern Categories';
	
	return $labels;
	
}
add_filter( 'taxonomy_labels_post_tag', __NAMESPACE__ . '\sgsdgsdg' );