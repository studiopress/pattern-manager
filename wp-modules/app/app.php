<?php
/**
 * Module Name: App
 * Description: The browser app where the work gets done.
 * Namespace: App
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\App;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render and enqueue the output required for the the app.
 */
function fse_studio_app() {
	$editor_settings = fse_studio_block_editor_init();

	$module_dir_path = module_dir_path( __FILE__ );
	$module_dir_url  = module_dir_url( __FILE__ );

	if ( file_exists( $module_dir_path . 'js/build/index.asset.php' ) ) {
		$dependencies = require $module_dir_path . 'js/build/index.asset.php';
		$dependencies = $dependencies['dependencies'];
	} else {
		return;
	}

	// Include the app.
	$js_url = $module_dir_url . 'js/build/index.js';
	$js_ver = filemtime( $module_dir_path . 'js/build/index.js' );
	wp_enqueue_script( 'fsestudio', $js_url, $dependencies, $js_ver, true );

	// Enqueue sass and Tailwind styles, combined automatically using PostCSS in wp-scripts.
	$css_url = $module_dir_url . 'js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'js/build/index.css' );
	wp_enqueue_style( 'fsethememanger_style', $css_url, array( 'wp-edit-blocks' ), $css_ver );

	$current_theme_dir = get_template();

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	// Make sure the theme WP thinks is active actually exists.
	if ( ! $wp_filesystem->exists( $wp_filesystem->wp_themes_dir() . $current_theme_dir . '/fsestudio-data.json' ) ) {
		$current_theme_dir = false;
	}

	wp_localize_script(
		'fsestudio',
		'fsestudio',
		array(
			'patterns'            => \FseStudio\PatternDataHandlers\get_patterns(),
			'initialTheme'        => $current_theme_dir,
			'themes'              => \FseStudio\ThemeDataHandlers\get_the_themes(),
			'themeJsonFiles'      => \FseStudio\ThemeJsonDataHandlers\get_all_theme_json_files(),
			'schemas'              => array(
				'themejson' => wp_json_file_decode( $wp_filesystem->wp_plugins_dir() . '/gutenberg/schemas/json/theme.json' ),
			),
			'frontendPreviewUrl'  => null,
			'apiEndpoints'        => array(
				'getPatternEndpoint'        => get_rest_url( false, 'fsestudio/v1/get-pattern/' ),
				'savePatternEndpoint'       => get_rest_url( false, 'fsestudio/v1/save-pattern/' ),
				'getThemeEndpoint'          => get_rest_url( false, 'fsestudio/v1/get-theme/' ),
				'saveThemeEndpoint'         => get_rest_url( false, 'fsestudio/v1/save-theme/' ),
				'getThemeJsonFileEndpoint'  => get_rest_url( false, 'fsestudio/v1/get-themejson-file/' ),
				'saveThemeJsonFileEndpoint' => get_rest_url( false, 'fsestudio/v1/save-themejson-file/' ),
			),
			'siteUrl'             => get_bloginfo( 'url' ),
			'defaultPostId'       => null,
			'blockEditorSettings' => $editor_settings,
		)
	);

	echo '<div id="fsestudioapp"></div>';
}

/**
 * Set the URL for the link in the menu.
 */
function fsestudio_adminmenu_page() {
	add_menu_page(
		__( 'FSE Studio', 'fse-studio' ),
		__( 'FSE Studio', 'fse-studio' ),
		'administrator',
		'fse-studio',
		__NAMESPACE__ . '\fse_studio_app',
		'dashicons-text',
		$position = 0,
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\fsestudio_adminmenu_page' );

/**
 * Initialize the Gutenberg Site Editor. Copied from gutenberg_edit_site_init.
 */
function fse_studio_block_editor_init() {
	// Flag that we're loading the block editor.
	$current_screen = get_current_screen();
	$current_screen->is_block_editor( true );

	// Load block patterns from w.org.
	_load_remote_block_patterns();
	_load_remote_featured_patterns();

	// Default to is-fullscreen-mode to avoid jumps in the UI.
	add_filter(
		'admin_body_class',
		static function( $classes ) {
			return "$classes is-fullscreen-mode";
		}
	);

	$indexed_template_types = array();
	foreach ( get_default_block_template_types() as $slug => $template_type ) {
		$template_type['slug']    = (string) $slug;
		$indexed_template_types[] = $template_type;
	}

	$block_editor_context = new \WP_Block_Editor_Context();
	$custom_settings      = array(
		'siteUrl'                              => site_url(),
		'postsPerPage'                         => get_option( 'posts_per_page' ),
		'styles'                               => get_block_editor_theme_styles(),
		'defaultTemplateTypes'                 => $indexed_template_types,
		'defaultTemplatePartAreas'             => get_allowed_block_template_part_areas(),
		'__experimentalBlockPatterns'          => \WP_Block_Patterns_Registry::get_instance()->get_all_registered(),
		'__experimentalBlockPatternCategories' => \WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered(),
	);
	$editor_settings      = get_block_editor_settings( $custom_settings, $block_editor_context );

	$active_global_styles_id = \WP_Theme_JSON_Resolver::get_user_global_styles_post_id();
	$active_theme            = wp_get_theme()->get_stylesheet();
	$preload_paths           = array(
		array( '/wp/v2/media', 'OPTIONS' ),
		'/',
		'/wp/v2/types?context=edit',
		'/wp/v2/types/wp_template?context=edit',
		'/wp/v2/types/wp_template-part?context=edit',
		'/wp/v2/taxonomies?context=edit',
		'/wp/v2/pages?context=edit',
		'/wp/v2/categories?context=edit',
		'/wp/v2/posts?context=edit',
		'/wp/v2/tags?context=edit',
		'/wp/v2/templates?context=edit&per_page=-1',
		'/wp/v2/template-parts?context=edit&per_page=-1',
		'/wp/v2/settings',
		'/wp/v2/themes?context=edit&status=active',
		'/wp/v2/global-styles/' . $active_global_styles_id . '?context=edit',
		'/wp/v2/global-styles/' . $active_global_styles_id,
		'/wp/v2/global-styles/themes/' . $active_theme,
	);

	block_editor_rest_api_preload( $preload_paths, $block_editor_context );

	// Preload server-registered block schemas.
	wp_add_inline_script(
		'wp-blocks',
		'wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
	);

	wp_enqueue_script( 'wp-edit-site' );
	wp_enqueue_script( 'wp-format-library' );
	wp_enqueue_style( 'wp-edit-site' );
	wp_enqueue_style( 'wp-format-library' );
	wp_enqueue_media();

	wp_enqueue_style( 'wp-block-library-theme' );

	/** This action is documented in wp-admin/edit-form-blocks.php */
	do_action( 'enqueue_block_editor_assets' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound

	return $editor_settings;
}

/**
 * Unhook all the admin_notices.
 *
 * @return void
 */
function hide_admin_notices() {
	if ( 'fse-studio' === filter_input( INPUT_GET, 'page', FILTER_SANITIZE_STRING ) ) {
		remove_all_actions( 'admin_notices' );
	}
}
add_action( 'admin_head', __NAMESPACE__ . '\hide_admin_notices', 1 );
