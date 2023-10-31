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

	if ( ! isset( $pattern['content'] ) ) {
		$pattern['content'] = '';
	}

	// Mock a post object with the pattern content as the body.
	mock_pattern_preview_post_object( $pattern['content'] );

	// This will process block supports using the Style Engine in WP core. See wp-includes/template-canvas.php.
	$template_html = get_the_block_template_html();

	// Helps to handle cases like Genesis themes, who enqueue their stylesheets using genesis_meta.
	do_action( 'patternmanager_before_pattern_preview_wp_head' );

	wp_head();

	?>
	<body style="overflow: hidden;" <?php body_class(); ?>>
	<?php

	do_action( 'patternmanager_before_pattern_preview' );

	echo $template_html; // phpcs:ignore WordPress.Security.EscapeOutput

	do_action( 'patternmanager_after_pattern_preview' );

	wp_footer();

	?>
	</body>
	<?php

	exit;
}
add_action( 'wp', __NAMESPACE__ . '\display_block_pattern_preview', PHP_INT_MAX );

/**
 * Create a fake post object for this pattern preview, and set it as the global $post for WordPress.
 *
 * @param string $pattern_content The block pattern raw html.
 */
function mock_pattern_preview_post_object( $pattern_content ) {
	global $wp, $wp_query, $_wp_current_template_content;

	$post_id              = -998; // negative ID, to avoid clash with a valid post.
	$post                 = new \stdClass();
	$post->ID             = $post_id;
	$post->post_author    = 1;
	$post->post_date      = current_time( 'mysql' );
	$post->post_date_gmt  = current_time( 'mysql', 1 );
	$post->post_title     = 'Pattern Preview';
	$post->post_content   = $pattern_content;
	$post->post_status    = 'publish';
	$post->comment_status = 'closed';
	$post->ping_status    = 'closed';
	$post->post_name      = 'pattern-preview-' . wp_rand( 1, 99999 ); // append random number to avoid clash.
	$post->post_type      = 'page';
	$post->filter         = 'raw';

	// Convert to WP_Post object.
	$wp_post = new \WP_Post( $post );

	// Add the fake post to the cache.
	wp_cache_add( $post_id, $wp_post, 'posts' );

	// Update the main query.
	$wp_query->post                 = $wp_post;
	$wp_query->posts                = array( $wp_post );
	$wp_query->queried_object       = $wp_post;
	$wp_query->queried_object_id    = $post_id;
	$wp_query->found_posts          = 1;
	$wp_query->post_count           = 1;
	$wp_query->max_num_pages        = 1;
	$wp_query->is_page              = true;
	$wp_query->is_singular          = true;
	$wp_query->is_single            = false;
	$wp_query->is_attachment        = false;
	$wp_query->is_archive           = false;
	$wp_query->is_category          = false;
	$wp_query->is_tag               = false;
	$wp_query->is_tax               = false;
	$wp_query->is_author            = false;
	$wp_query->is_date              = false;
	$wp_query->is_year              = false;
	$wp_query->is_month             = false;
	$wp_query->is_day               = false;
	$wp_query->is_time              = false;
	$wp_query->is_search            = false;
	$wp_query->is_feed              = false;
	$wp_query->is_comment_feed      = false;
	$wp_query->is_trackback         = false;
	$wp_query->is_home              = false;
	$wp_query->is_embed             = false;
	$wp_query->is_404               = false;
	$wp_query->is_paged             = false;
	$wp_query->is_admin             = false;
	$wp_query->is_preview           = false;
	$wp_query->is_robots            = false;
	$wp_query->is_posts_page        = false;
	$wp_query->is_post_type_archive = false;

	// Update globals.
	$GLOBALS['wp_query'] = $wp_query; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
	$wp->register_globals();

	// Back-fill the variable core uses to render post content. See the core function called get_the_block_template_html.
	$_wp_current_template_content = $pattern_content; // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
}
