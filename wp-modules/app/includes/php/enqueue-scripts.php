<?php
/**
 * FSE Theme Manager App.
 *
 * @package fse-studio
 */

namespace FseStudio\App;

/**
 * Exit if accessed directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render and enqueue the output required for the the app.
 */
function fse_studio_app() {
	global $post;

	$default_post_id = get_option( 'fse_studio_default_post_id' );

	if ( ! isset( $_GET['post'] ) ) { //phpcs:ignore.
		//return;
	}

	//if ( is_admin() ) {
	//	if ( absint( $_GET['post'] ) !== absint( $default_post_id ) ) { //phpcs:ignore.
			//return;
	//	}
	//}
	
	block_editor_pre_flight();

	$module_dir_path = module_dir_path( __FILE__ );
	$module_dir_url  = module_dir_url( __FILE__ );

	if ( file_exists( $module_dir_path . 'includes/js/build/index.asset.php' ) ) {
		$dependencies = require $module_dir_path . 'includes/js/build/index.asset.php';
		$dependencies = $dependencies['dependencies'];
	} else {
		return;
	}

	// Include the app.
	$js_url = $module_dir_url . 'includes/js/build/index.js';
	$js_ver = filemtime( $module_dir_path . 'includes/js/build/index.js' );
	wp_enqueue_script( 'fsestudio', $js_url, $dependencies, $js_ver, true );

	// Enqueue sass and Tailwind styles, combined automatically using PostCSS in wp-scripts.
	$css_url = $module_dir_url . 'includes/js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'includes/js/build/index.css' );
	wp_enqueue_style( 'fsethememanger_style', $css_url, array( 'wp-edit-blocks' ), $css_ver );
	
	$block_editor_context = new \WP_Block_Editor_Context();
	$custom_settings      = array(
		'siteUrl'                              => site_url(),
		'postsPerPage'                         => get_option( 'posts_per_page' ),
		'styles'                               => get_block_editor_theme_styles(),
		'defaultTemplatePartAreas'             => get_allowed_block_template_part_areas(),
		'__experimentalBlockPatterns'          => \WP_Block_Patterns_Registry::get_instance()->get_all_registered(),
		'__experimentalBlockPatternCategories' => \WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered(),
	);
	$editor_settings      = get_block_editor_settings( $custom_settings, $block_editor_context );

	wp_localize_script(
		'fsestudio',
		'fsestudio',
		array(
			'patterns'           => \FseStudio\PatternDataHandlers\get_patterns(),
			'themes'             => \FseStudio\ThemeDataHandlers\get_the_themes(),
			'themeJsonFiles'     => \FseStudio\ThemeJsonDataHandlers\get_all_theme_json_files(),
			'frontendPreviewUrl' => get_permalink( $default_post_id ),
			'apiEndpoints'       => array(
				'getPatternEndpoint'         => get_rest_url( false, 'fsestudio/v1/get-pattern/' ),
				'savePatternEndpoint'        => get_rest_url( false, 'fsestudio/v1/save-pattern/' ),
				'getThemeEndpoint'           => get_rest_url( false, 'fsestudio/v1/get-theme/' ),
				'saveThemeEndpoint'          => get_rest_url( false, 'fsestudio/v1/save-theme/' ),
				'getThemeJsonFileEndpoint'   => get_rest_url( false, 'fsestudio/v1/get-themejson-file/' ),
				'saveThemeJsonFileEndpoint'  => get_rest_url( false, 'fsestudio/v1/save-themejson-file/' ),
				'getGlobalStylesCssEndpoint' => get_rest_url( false, 'fsestudio/v1/get-global-styles-css/' ),
			),
			'siteUrl'            => get_bloginfo( 'url' ),
			'defaultPostId'      => $default_post_id,
			'blockEditorSettings' => $editor_settings,
		)
	);

	echo '<div id="fsestudioapp"></div>';
}
//add_action( 'admin_init', __NAMESPACE__ . '\fse_studio_app' );

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

function render_fsestudio_admin_page() {
	?>
	hi
	<?php
}

/**
 * Load editor styles (this is copied from edit-form-blocks.php).
 * Ideally the code is extracted into a reusable function.
 *
 * @return array Editor Styles Setting.
 */
function block_editor_pre_flight() {
	global $post, $editor_styles;

	/** WordPress Administration Bootstrap */
	//require_once dirname(dirname(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))))) . '/wp-admin/admin.php';
	
	if ( ! current_user_can( 'edit_theme_options' ) ) {
		wp_die(
			'<h1>' . __( 'You need a higher level of permission.' ) . '</h1>' .
			'<p>' . __( 'Sorry, you are not allowed to edit theme options on this site.' ) . '</p>',
			403
		);
	}
	
	if ( ! wp_is_block_theme() ) {
		//wp_die( __( 'The theme you are currently using is not compatible with Full Site Editing.' ) );
	}
	
	// Used in the HTML title tag.
	$title       = __( 'Editor (beta)' );
	$parent_file = 'themes.php';
	
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
	
	if ( isset( $_GET['postType'] ) && ! isset( $_GET['postId'] ) ) {
		$post_type = get_post_type_object( $_GET['postType'] );
		if ( ! $post_type ) {
			wp_die( __( 'Invalid post type.' ) );
		}
	}
	
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
	
	
	wp_add_inline_script(
		'wp-edit-site',
		sprintf(
			'wp.domReady( function() {
				wp.editSite.initializeEditor( "site-editor", %s );
			} );',
			wp_json_encode( $editor_settings )
		)
	);
	
	
	// Preload server-registered block schemas.
	wp_add_inline_script(
		'wp-blocks',
		'wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
	);
	
	wp_add_inline_script(
		'wp-blocks',
		sprintf( 'wp.blocks.setCategories( %s );', wp_json_encode( get_block_categories( $post ) ) ),
		'after'
	);
	
	wp_enqueue_script( 'wp-edit-site' );
	wp_enqueue_script( 'wp-format-library' );
	wp_enqueue_style( 'wp-edit-site' );
	wp_enqueue_style( 'wp-format-library' );
	wp_enqueue_media();
	
	if (
		current_theme_supports( 'wp-block-styles' ) ||
		( ! is_array( $editor_styles ) || count( $editor_styles ) === 0 )
	) {
		//wp_enqueue_style( 'wp-block-library-theme' );
	}
	
	/** This action is documented in wp-admin/edit-form-blocks.php */
	//do_action( 'enqueue_block_editor_assets' );
}
