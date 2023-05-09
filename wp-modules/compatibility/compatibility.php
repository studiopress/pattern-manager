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
	do_action( 'genesis_meta' ); //phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
}
add_action( 'patternmanager_before_pattern_preview_wp_head', __NAMESPACE__ . '\before_pattern_preview_wp_head' );

/**
 * For pattern previews, render the site-container div normally rendered by Genesis Framework
 */
function before_pattern_preview() {
	if ( function_exists( 'genesis' ) ) {
		genesis_markup(
			[
				'open'    => '<div %s>',
				'context' => 'site-container',
			]
		);
		genesis_markup(
			[
				'open'    => '<main %s>',
				'context' => 'content',
			]
		);
		genesis_markup(
			[
				'open'    => '<div %s>',
				'context' => 'entry-content',
			]
		);
	}
}
add_action( 'patternmanager_before_pattern_preview', __NAMESPACE__ . '\before_pattern_preview' );

/**
 * For pattern previews, close the site-container div normally rendered by Genesis Framework
 */
function after_pattern_preview() {
	if ( function_exists( 'genesis' ) ) {
		genesis_markup(
			[
				'close'   => '</div>',
				'context' => 'site-container',
			]
		);
		genesis_markup(
			[
				'open'    => '</main>',
				'context' => 'content',
			]
		);
		genesis_markup(
			[
				'open'    => '</div>',
				'context' => 'entry-content',
			]
		);
	}
}
add_action( 'patternmanager_after_pattern_preview', __NAMESPACE__ . '\after_pattern_preview' );
