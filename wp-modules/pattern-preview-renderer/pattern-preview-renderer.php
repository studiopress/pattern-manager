<?php
/**
 * Module Name: Pattern Preview Renderer
 * Description: This module makes a front-end render of a block pattern, useful inside iframes or other places you wish to preview a block pattern.
 * Namespace: PatternPreviewRenderer
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\PatternPreviewRenderer;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Receive pattern id in the URL and display its content. Useful for pattern previews and thumbnails.
 */
function display_block_pattern_preview() {
	// Nonce not required as the user is not taking any action here.
	if ( ! isset( $_GET['pm_pattern_preview'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return;
	}

	$pattern_name = sanitize_text_field( wp_unslash( $_GET['pm_pattern_preview'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

	$pattern = \PatternManager\PatternDataHandlers\get_pattern_by_name( $pattern_name );

	// Handle Genesis themes, who enqueue their stylesheets using genesis_meta.
	do_action( 'patternmanager_before_pattern_preview_wp_head' );

	$the_content = do_the_content_things( $pattern['content'] ?? '' );

	wp_head();

	do_action( 'patternmanager_before_pattern_preview' );

	echo wp_kses_post( $the_content );

	do_action( 'patternmanager_after_pattern_preview' );

	wp_footer();

	exit;
}
add_action( 'init', __NAMESPACE__ . '\display_block_pattern_preview', PHP_INT_MAX );

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
