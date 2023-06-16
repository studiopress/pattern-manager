<?php
/**
 * Module Name: Editor
 * Description: This module registers a post type to be used when editing block patterns, and sets up how things work in the block editor.
 * Namespace: Editor
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\Editor;

use WP_Block_Pattern_Categories_Registry;
use function PatternManager\PatternDataHandlers\get_pattern_by_name;
use function PatternManager\PatternDataHandlers\get_pattern_defaults;
use function PatternManager\PatternDataHandlers\get_pattern_names;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once trailingslashit( __DIR__ ) . 'utils.php';
require_once trailingslashit( __DIR__ ) . 'model.php';

/**
 * Create a custom post type to be used for our default post.
 */
function register_pattern_post_type() {
	$post_type_key = get_pattern_post_type();
	$labels        = array(
		'name'           => __( 'Patterns', 'pattern-manager' ),
		'singular_name'  => __( 'Pattern', 'pattern-manager' ),
		'add_new_item'   => __( 'Pattern Editor', 'pattern-manager' ),
		'item_published' => __( 'Pattern created', 'pattern-manager' ),
		'item_updated'   => __( 'Pattern saved to your theme directory', 'pattern-manager' ),
	);

	register_post_type(
		$post_type_key,
		array(
			'public'       => false,
			'has_archive'  => false,
			'show_ui'      => true,
			'show_in_menu' => false,
			'show_in_rest' => true,
			'supports'     => array(
				'editor',
				'custom-fields',
				'title',
			),
			'labels'       => $labels,
		)
	);

	register_post_meta(
		$post_type_key,
		'name',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
			'default'      => get_pattern_defaults()['name'],
		)
	);

	register_post_meta(
		$post_type_key,
		'description',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
			'default'      => get_pattern_defaults()['description'],
		)
	);

	register_post_meta(
		$post_type_key,
		'inserter',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'boolean',
			'default'      => get_pattern_defaults()['inserter'],
		)
	);

	register_post_meta(
		$post_type_key,
		'viewportWidth',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'number',
			'default'      => get_pattern_defaults()['viewportWidth'],
		)
	);

	/**
	 * Add blockTypes array post meta.
	 *
	 * Must define schema for 'show_in_rest' array.
	 * @see https://make.wordpress.org/core/2019/10/03/wp-5-3-supports-object-and-array-meta-types-in-the-rest-api/
	 */
	register_post_meta(
		$post_type_key,
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
			'default'      => get_pattern_defaults()['blockTypes'],
		)
	);

	register_post_meta(
		$post_type_key,
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
			'default'      => get_pattern_defaults()['postTypes'],
		)
	);

	register_post_meta(
		$post_type_key,
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
			'default'      => get_pattern_defaults()['categories'],
		)
	);

	register_post_meta(
		$post_type_key,
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
			'default'      => get_pattern_defaults()['keywords'],
		)
	);

	register_post_meta(
		$post_type_key,
		'customCategories',
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
			'default'      => [],
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_pattern_post_type' );

/**
 * Disable auto-save for this post type.
 *
 */
function disable_autosave() {
	global $post_type;
	if ( get_pattern_post_type() === $post_type ) {
		wp_dequeue_script( 'autosave' );
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\disable_autosave' );

/**
 * Add style and metaboxes to pm_pattern posts when editing.
 */
function enqueue_meta_fields_in_editor() {
	if ( get_pattern_post_type() !== get_post_type() ) {
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
			'activeTheme'       => basename( get_stylesheet_directory() ),
			'apiEndpoints'      => array(
				'getPatternNamesEndpoint' => get_rest_url( false, 'pattern-manager/v1/get-pattern-names/' ),
			),
			'apiNonce'          => wp_create_nonce( 'wp_rest' ),
			'patternCategories' => \WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered(),
			'patternNames'      => get_pattern_names(),
			'patterns'          => \PatternManager\PatternDataHandlers\get_theme_patterns_with_editor_links(),
			'siteUrl'           => get_bloginfo( 'url' ),
		]
	);

	// Enqueue styles, combined automatically using PostCSS in wp-scripts.
	$css_url = $module_dir_url . 'js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'js/build/index.css' );
	wp_enqueue_style( 'pattern_manager_post_meta_style', $css_url, array(), $css_ver );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_meta_fields_in_editor' );
