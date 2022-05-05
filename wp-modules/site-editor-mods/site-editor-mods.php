<?php
/**
 * Module Name: Site Editor Mods
 * Description: This module enqueues custom javascript and css on the site-editor, allowing for customizations to it.
 * Namespace: SiteEditorMods
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\SiteEditorMods;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue custom JS and CSS for Site Editor.
 */
function enqueue() {
	$current_screen = get_current_screen();

	// Only enqueue on the site editor.
	if ( strpos( $current_screen->base, 'edit-site' ) === false ) {
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

	$js_url = $module_dir_url . 'js/build/index.js';
	$js_ver = filemtime( $module_dir_path . 'js/build/index.js' );
	wp_enqueue_script( 'fsestudio_site_editor_style', $js_url, $dependencies, $js_ver, true );

	$css_url = $module_dir_url . 'js/build/index.css';
	$css_ver = filemtime( $module_dir_path . 'js/build/index.css' );
	wp_enqueue_style( 'fsestudio_site_editor_style', $css_url, array(), $css_ver );
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue' );

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
