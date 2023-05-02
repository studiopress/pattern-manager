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

	$the_content = \PatternManager\HelperFunctions\do_the_content_things( $pattern['content'] ?? '' );

	wp_head();

	?><body <?php body_class(); ?>>
	<?php

	do_action( 'patternmanager_before_pattern_preview' );

	echo wp_kses_post( $the_content );

	do_action( 'patternmanager_after_pattern_preview' );

	wp_footer();

	?>
	</body>
	<?php

	exit;
}
add_action( 'init', __NAMESPACE__ . '\display_block_pattern_preview', PHP_INT_MAX );
