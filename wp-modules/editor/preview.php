<?php
/**
 * Module Name: Editor
 * Namespace: Editor
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\Editor;

use function PatternManager\PatternDataHandlers\get_pattern_by_name;

/**
 * Receive pattern id in the URL and display its content. Useful for pattern previews and thumbnails.
 */
function display_block_pattern_preview() {
	if ( ! isset( $_GET['pm_pattern_preview'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return;
	}

	$pattern_name = sanitize_text_field( wp_unslash( $_GET['pm_pattern_preview'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

	$pattern = get_pattern_by_name( $pattern_name );

	$the_content = do_the_content_things( $pattern['content'] ?? '' );

	wp_head();

	echo $the_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

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
 * If we are on the pattern-manager app page, register the patterns with WP.
 *
 * @return void
 */
function register_block_patterns() {
	$current_screen = get_current_screen();

	if ( get_pattern_post_type() !== $current_screen->post_type ) {
		return;
	}

	$patterns = \PatternManager\PatternDataHandlers\get_theme_patterns();

	foreach ( $patterns as $pattern ) {
		if ( isset( $pattern['categories'] ) ) {
			foreach ( $pattern['categories'] as $category ) {
				register_block_pattern_category( $category, array( 'label' => ucwords( str_replace( '-', ' ', $category ) ) ) );
			}
		}
		register_block_pattern(
			$pattern['name'],
			$pattern,
		);
	}
}
add_action( 'current_screen', __NAMESPACE__ . '\register_block_patterns', 9 );

/**
 * Enables the Core Comments block to render by adding a 'postId'.
 *
 * @param array $context The rendered block context.
 * @param array $parsed_block The block to render.
 * @return array The filtered context.
 */
function add_post_id_to_block_context( $context, $parsed_block ) {
	if ( ! filter_input( INPUT_GET, 'pm_pattern_preview' ) ) {
		return $context;
	}

	return isset( $parsed_block['blockName'] ) && 0 === strpos( $parsed_block['blockName'], 'core/comment' )
		? array_merge(
			$context,
			[ 'postId' => get_post_id_with_comment() ?? intval( get_option( 'page_on_front' ) ) ]
		)
		: $context;
}
add_filter( 'render_block_context', __NAMESPACE__ . '\add_post_id_to_block_context', 10, 2 );
