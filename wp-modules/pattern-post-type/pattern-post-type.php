<?php
/**
 * Module Name: Pattern Post Type
 * Description: This module registers a post type to be used when editing block patterns, and sets up how things work in the block editor.
 * Namespace: PatternPostType
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
	if ( isset( $_GET['post'] ) ) {
		$post_id      = absint( $_GET['post'] );
		$post_type    = get_post_type( $post_id );
		$pattern_type = get_post_meta( $post_id, 'type', true );
	} else {
		$pattern_type = 'pattern';
	}

	$labels = array(
		'name'          => __( 'Patterns', 'fse-studio' ),
		'singular_name' => __( 'Pattern', 'fse-studio' ),
	);

	if ( 'pattern' === $pattern_type ) {
		$labels = array(
			'name'          => __( 'Patterns', 'fse-studio' ),
			'singular_name' => __( 'Pattern', 'fse-studio' ),
		);
	}

	if ( 'template' === $pattern_type ) {
		$labels = array(
			'name'          => __( 'Templates', 'fse-studio' ),
			'singular_name' => __( 'Template', 'fse-studio' ),
		);
	}

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
			'labels'       => $labels,
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
 * Recieve blocks in the URL and display them. Useful for previews and thumbnails.
 */
function display_block_pattern_preview() {
	if ( ! isset( $_GET['fsestudio_pattern_preview'] ) ) { //phpcs:ignore
		return;
	}

	$post_id = absint( $_GET['fsestudio_pattern_preview'] );

	$post = get_post( $post_id );

	$the_content = do_the_content_things( $post->post_content );

	wp_head();

	echo $the_content;

	wp_footer();

	exit;
}
add_action( 'init', __NAMESPACE__ . '\display_block_pattern_preview' );

/**
 * Run a string of HTML through the_content filters. This makes it so everything needed will be rendered in wp_footer.
 *
 * @param string $content The html content to run through the filters.
 * @return bool
 */
function do_the_content_things( $content ) {

	// Run through the actions that are typically taken on the_content.
	$content = do_blocks( $content );
	$content = wptexturize( $content );
	$content = convert_smilies( $content );
	$content = shortcode_unautop( $content );
	$content = wp_filter_content_tags( $content );
	$content = do_shortcode( $content );

	// Handle embeds for block template parts.
	global $wp_embed;
	$content = $wp_embed->autoembed( $content );

	return $content;
}

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
add_action( 'init', __NAMESPACE__ . '\register_block_patterns', 9 );

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
		return 'Pattern Categories';
	}

	return $translation;
}
add_filter( 'gettext', __NAMESPACE__ . '\modify_terms', 10, 3 );
