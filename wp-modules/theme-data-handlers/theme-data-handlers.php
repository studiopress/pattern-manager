<?php
/**
 * Module Name: Theme Data Handlers
 * Description: This module contains functions for getting and saving theme data.
 * Namespace: ThemeDataHandlers
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\ThemeDataHandlers;

use WP_REST_Response;
use function switch_theme;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get data for a single themes in the format used by Theme Manager.
 *
 * @return array
 */
function get_theme() {
	$wpthemes = wp_get_themes();

	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$formatted_theme_data = [];

	$wpthemes = wp_get_themes();

	$file_headers = array(
		'Name'        => 'Theme Name',
		'ThemeURI'    => 'Theme URI',
		'Description' => 'Description',
		'Author'      => 'Author',
		'AuthorURI'   => 'Author URI',
		'Version'     => 'Version',
		'Template'    => 'Template',
		'Status'      => 'Status',
		'Tags'        => 'Tags',
		'TextDomain'  => 'Text Domain',
		'DomainPath'  => 'Domain Path',
		'RequiresWP'  => 'Requires at least',
		'RequiresPHP' => 'Requires PHP',
		'UpdateURI'   => 'Update URI',
	);

	$theme_slug = get_template();
	$theme_data = $wpthemes[ $theme_slug ];

	$theme_root = get_theme_root( $theme_slug );
	$theme_dir  = "$theme_root/$theme_slug";

	$theme = get_file_data( $theme_dir . '/style.css', $file_headers, 'theme' );

	/** This filter is documented in wp-includes/theme.php */
	$theme_dir = apply_filters( 'template_directory', $theme_dir, $theme_slug, $theme_root ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound

	// Create a namespace from a theme slug.
	$theme_slug_parts = explode( '-', $theme_slug );
	$namespace        = implode( '', array_map( 'ucfirst', explode( '-', $theme_slug ) ) );
	foreach ( $theme_slug_parts as $theme_slug_part ) {
		$namespace .= ucfirst( $theme_slug_part );
	}

	$theme_json = $wp_filesystem->get_contents( "$theme_dir/theme.json" );

	return [
		'id'                => $theme_slug,
		'name'              => $theme['Name'],
		'dirname'           => $theme_slug,
		'namespace'         => $namespace,
		'uri'               => $theme['ThemeURI'],
		'author'            => $theme['Author'],
		'author_uri'        => $theme['AuthorURI'],
		'description'       => $theme['Description'],
		'tags'              => $theme['Tags'],
		'tested_up_to'      => $theme['Description'],
		'requires_wp'       => $theme['RequiresWP'],
		'requires_php'      => $theme['RequiresPHP'],
		'version'           => $theme['Version'],
		'text_domain'       => $theme['TextDomain'],
		'included_patterns' => \PatternManager\PatternDataHandlers\get_theme_patterns( $theme_dir ),
		'theme_json_file'   => ! $theme_json ? [] : json_decode( $theme_json, true ),
		'styles'            => [],
	];
}

/**
 * Update a single theme.
 *
 * @param array $patterns The new patterns.
 * @param bool $update_patterns Whether we should update patterns as part of this, or not. Note that when in the UI/App, patterns will save themselves after this is done, so we don't need to save patterns here, which is why this boolean option exists.
 * @return array
 */
function update_patterns( $patterns ) {
	\PatternManager\PatternDataHandlers\delete_patterns_not_present( $patterns );


	// Note we do not check $update_patterns here. This is because included_patterns are treated differently than template_files and template_parts, in that they are saved WITH the theme data, while template things are saved separately in the site editor.
	foreach ( $patterns as $pattern_name => $pattern ) {
		\PatternManager\PatternDataHandlers\update_pattern( $pattern );
	}

	// Now that all patterns have been saved, remove any images no longer needed in the theme.
	\PatternManager\PatternDataHandlers\tree_shake_theme_images();

	return $patterns;
}
