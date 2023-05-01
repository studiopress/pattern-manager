<?php
/**
 * Module Name: Compatibility
 * Description: This module contains compatibility code for things like Genesis Framework, to make sure block pattern previews work as expected.
 * Namespace: Compatibility
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\Compatibility;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * For pattern previews, handle Genesis themes, who enqueue their stylesheets using genesis_meta.
 */
function before_pattern_preview_wp_head() {
	do_action( 'genesis_meta' );
}
add_action( 'pm_before_pattern_preview_wp_head', __NAMESPACE__ . '\before_pattern_preview_wp_head' );

/**
 * For pattern previews, render the site-container div normally rendered by Genesis Framework
 */
function before_pattern_preview() {
	if ( function_exists( 'genesis' ) ) {
		?><div class="<?php echo esc_attr('site-container'); ?>"><?php
	}
}
add_action( 'pm_before_pattern_preview', __NAMESPACE__ . '\before_pattern_preview' );

/**
 * For pattern previews, close the site-container div normally rendered by Genesis Framework
 */
function after_pattern_preview() {
	if ( function_exists( 'genesis' ) ) {
		?></div><?php
	}
}
add_action( 'pm_after_pattern_preview', __NAMESPACE__ . '\after_pattern_preview' );
