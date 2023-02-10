<?php
/**
 * Module Name: Pattern Post Type
 * Description: This module registers a post type to be used when editing block patterns, and sets up how things work in the block editor.
 * Namespace: PatternPostType
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\PatternPostType;

use function PatternManager\PatternDataHandlers\delete_patterns_not_present;
use function PatternManager\PatternDataHandlers\get_pattern_by_name;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once module_dir_path( __FILE__ ) . 'model.php';
require_once module_dir_path( __FILE__ ) . 'utils.php';

/**
 * Create a custom post type to be used for our default post.
 */
function pattern_post_type() {
	if ( isset( $_GET['post'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$post_id      = absint( $_GET['post'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$post_type    = get_post_type( $post_id );
		$pattern_type = get_post_meta( $post_id, 'type', true );
	} else {
		$pattern_type = 'pattern';
	}

	$labels = array(
		'name'          => __( 'Patterns', 'pattern-manager' ),
		'singular_name' => __( 'Pattern', 'pattern-manager' ),
	);

	if ( 'pattern' === $pattern_type ) {
		$labels = array(
			'name'          => __( 'Patterns', 'pattern-manager' ),
			'singular_name' => __( 'Pattern', 'pattern-manager' ),
			'add_new_item'  => __( 'Pattern Editor', 'pattern-manager' ),
		);
	}

	if ( 'template' === $pattern_type ) {
		$labels = array(
			'name'          => __( 'Templates', 'pattern-manager' ),
			'singular_name' => __( 'Template', 'pattern-manager' ),
		);
	}

	register_post_type(
		'pm_pattern',
		array(
			'public'       => false,
			'has_archive'  => false,
			'show_ui'      => true,
			'show_in_menu' => false,
			'show_in_rest' => true,
			'supports'     => array(
				'editor',
				'custom-fields',
			),
			'labels'       => $labels,
		)
	);

	register_post_meta(
		'pm_pattern',
		'type',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
		)
	);

	register_post_meta(
		'pm_pattern',
		'title',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
		)
	);

	register_post_meta(
		'pm_pattern',
		'name',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
		)
	);

	register_post_meta(
		'pm_pattern',
		'description',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
		)
	);

	register_post_meta(
		'pm_pattern',
		'inserter',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'boolean',
		)
	);

	/**
	 * Add blockTypes array post meta.
	 *
	 * Must define schema for 'show_in_rest' array.
	 * @see https://make.wordpress.org/core/2019/10/03/wp-5-3-supports-object-and-array-meta-types-in-the-rest-api/
	 */
	register_post_meta(
		'pm_pattern',
		'blockTypes',
		array(
			'show_in_rest' => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
			),
			'single'       => true,
			'type'         => 'array',
		)
	);

	register_post_meta(
		'pm_pattern',
		'postTypes',
		array(
			'show_in_rest' => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
			),
			'single'       => true,
			'type'         => 'array',
		)
	);

	register_post_meta(
		'pm_pattern',
		'categories',
		array(
			'show_in_rest' => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
			),
			'single'       => true,
			'type'         => 'array',
		)
	);

	register_post_meta(
		'pm_pattern',
		'keywords',
		array(
			'show_in_rest' => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
			),
			'single'       => true,
			'type'         => 'array',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\pattern_post_type' );

/**
 * Disable auto-save for this post type.
 *
 */
function disable_autosave() {
	global $post_type;
	if ( 'pm_pattern' === $post_type ) {
		wp_dequeue_script( 'autosave' );
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\disable_autosave' );

/**
 * Recieve pattern id in the URL and display its content. Useful for pattern previews and thumbnails.
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
 * Add style and metaboxes to pm_pattern posts when editing.
 */
function enqueue_meta_fields_in_editor() {
	if ( 'pm_pattern' !== get_post_type() ) {
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

	// Include the js on the block editor page for the pm_pattern post type.
	$js_url = $module_dir_url . 'js/build/index.js';
	$js_ver = filemtime( $module_dir_path . 'js/build/index.js' );
	wp_enqueue_script( 'pattern_manager_post_meta', $js_url, $dependencies, $js_ver, true );
	wp_localize_script(
		'pattern_manager_post_meta',
		'patternManager',
		[
			'apiEndpoints' => array(
				'getPatternNamesEndpoint' => get_rest_url( false, 'pattern-manager/v1/get-pattern-names/' ),
			),
			'apiNonce'     => wp_create_nonce( 'wp_rest' ),
			'patternNames' => \PatternManager\PatternDataHandlers\get_pattern_names(),
			'siteUrl'      => get_bloginfo( 'url' ),
		]
	);

	// Enqueue styles, combined automatically using PostCSS in wp-scripts.
	$css_url = $module_dir_url . 'js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'js/build/index.css' );
	wp_enqueue_style( 'pattern_manager_post_meta_style', $css_url, array(), $css_ver );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_meta_fields_in_editor' );

/**
 * If we are on the pattern-manager app page, register the patterns with WP.
 *
 * @return void
 */
function register_block_patterns() {
	$current_screen = get_current_screen();

	if ( 'pm_pattern' !== $current_screen->post_type ) {
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
