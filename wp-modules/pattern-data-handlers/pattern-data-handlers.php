<?php
/**
 * Module Name: Pattern Data Handlers
 * Description: This module contains functions for getting and saving pattern data.
 * Namespace: PatternDataHandlers
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\PatternDataHandlers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the data for all patterns available.
 *
 * @return array
 */
function get_patterns() {
	$default_headers = array(
		'title'         => 'Title',
		'slug'          => 'Slug',
		'description'   => 'Description',
		'viewportWidth' => 'Viewport Width',
		'categories'    => 'Categories',
		'keywords'      => 'Keywords',
		'blockTypes'    => 'Block Types',
		'postTypes'     => 'Post Types',
		'inserter'      => 'Inserter',
	);

	$module_dir_path = module_dir_path( __FILE__ );

	/**
	 * Scan Patterns directory and auto require all PHP files, and register them as block patterns.
	 */
	$pattern_file_paths = glob( $module_dir_path . '/pattern-files/*.php' );

	$patterns = array();

	foreach ( $pattern_file_paths as $path ) {
		$pattern_data = format_pattern_data( get_file_data( $path, $default_headers ), $path );
		if ( ! $pattern_data ) {
			continue;
		}
		$pattern_data['name']                  = basename( $path, '.php' );
		$patterns[ basename( $path, '.php' ) ] = $pattern_data;
	}

	// Get the custom patterns (ones created by the user, not included in the plugin).
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();
	$wp_themes_dir = $wp_filesystem->wp_themes_dir();

	$themes = glob( $wp_themes_dir . '*' );

	foreach ( $themes as $theme ) {

		// Grab all of the pattrns in this theme.
		$pattern_file_paths = glob( $theme . '/patterns/*.php' );

		foreach ( $pattern_file_paths as $path ) {
			$pattern_data = format_pattern_data( get_file_data( $path, $default_headers ), $path );
			if ( ! $pattern_data ) {
				continue;
			}
			$pattern_data['name'] = basename( $path, '.php' );
			$pattern_data['type'] = 'pattern';

			$patterns[ basename( $path, '.php' ) ] = $pattern_data;
		}
	}

	return $patterns;
}

/**
 * This function validates and standardizes the data retrieved from a theme pattern file's php header.
 * It is taken/modified from Gutenberg's https://github.com/WordPress/gutenberg/blob/b3cac2c86e3a364a8c52970c25db5f00ed3e9fb6/lib/compat/wordpress-6.0/block-patterns.php#L77
 *
 * @param array  $pattern_data The data retrieved from get_file_data.
 * @param string $file The path to the theme pattern file.
 */
function format_pattern_data( $pattern_data, $file ) {
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();
	if ( empty( $pattern_data['slug'] ) ) {
		_doing_it_wrong(
			'_register_theme_block_patterns',
			sprintf(
				/* translators: %s: file name. */
				esc_html( __( 'Could not register file "%s" as a block pattern ("Slug" field missing)', 'pattern-manager' ) ),
				esc_html( $file )
			),
			'6.0.0'
		);
		return false;
	}

	if ( ! preg_match( '/^[A-z0-9\/_-]+$/', $pattern_data['slug'] ) ) {
		_doing_it_wrong(
			'_register_theme_block_patterns',
			sprintf(
				/* translators: %1s: file name; %2s: slug value found. */
				esc_html( __( 'Could not register file "%1$s" as a block pattern (invalid slug "%2$s")', 'pattern-manager' ) ),
				esc_html( $file ),
				esc_html( $pattern_data['slug'] )
			),
			'6.0.0'
		);
	}

	// Title is a required property.
	if ( ! $pattern_data['title'] ) {
		_doing_it_wrong(
			'_register_theme_block_patterns',
			sprintf(
				/* translators: %1s: file name; %2s: slug value found. */
				esc_html( __( 'Could not register file "%s" as a block pattern ("Title" field missing)', 'pattern-manager' ) ),
				esc_html( $file )
			),
			'6.0.0'
		);
		return false;
	}

	// For properties of type array, parse data as comma-separated.
	foreach ( array( 'categories', 'keywords', 'blockTypes', 'postTypes' ) as $property ) {
		if ( ! empty( $pattern_data[ $property ] ) ) {
			$pattern_data[ $property ] = array_map(
				// Trim whitespace at start and end of each element.
				'trim',
				// Filter out falsy values.
				array_filter(
					explode(
						',',
						(string) $pattern_data[ $property ]
					)
				)
			);
		} else {
			unset( $pattern_data[ $property ] );
		}
	}

	// Parse properties of type int.
	foreach ( array( 'viewportWidth' ) as $property ) {
		if ( ! empty( $pattern_data[ $property ] ) ) {
			$pattern_data[ $property ] = (int) $pattern_data[ $property ];
		} else {
			unset( $pattern_data[ $property ] );
		}
	}

	// Parse properties of type bool.
	foreach ( array( 'inserter' ) as $property ) {
		if ( ! empty( $pattern_data[ $property ] ) ) {
			$pattern_data[ $property ] = 'true' === $pattern_data[ $property ];
		} else {
			unset( $pattern_data[ $property ] );
		}
	}

	$theme = wp_get_theme();

	// Translate the pattern metadata.
	$text_domain = $theme->get( 'TextDomain' );
	//phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText, WordPress.WP.I18n.NonSingularStringLiteralContext, WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
	$pattern_data['title'] = translate_with_gettext_context( $pattern_data['title'], 'Pattern title', $text_domain );
	if ( ! empty( $pattern_data['description'] ) ) {
		//phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText, WordPress.WP.I18n.NonSingularStringLiteralContext, WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
		$pattern_data['description'] = translate_with_gettext_context( $pattern_data['description'], 'Pattern description', $text_domain );
	}

	// The actual pattern content is the output of the file.
	ob_start();
	include $file;
	$pattern_data['content'] = ob_get_clean();

	if ( ! $pattern_data['content'] ) {
		return false;
	}
	return $pattern_data;
}

/**
 * Get the pattern data for a specific pattern from a specific theme.
 *
 * @param string $pattern_id The name of the pattern to get.
 * @param string $theme_path The path to the theme. Defaults to the current active theme.
 * @return array
 */
function get_theme_pattern( $pattern_id, $theme_path = false ) {
	$patterns_data = get_theme_patterns( $theme_path );
	if ( ! isset( $patterns_data[ $pattern_id ] ) ) {
		return [];
	}

	$pattern_data = $patterns_data[ $pattern_id ];

	return $pattern_data;
}

/**
 * Get the pattern data for all patterns in a theme.
 *
 * @param string $theme_path The path to the theme. Defaults to the current active theme.
 * @return array
 */
function get_theme_patterns( $theme_path = false ) {
	$default_headers = array(
		'title'         => 'Title',
		'slug'          => 'Slug',
		'description'   => 'Description',
		'viewportWidth' => 'Viewport Width',
		'categories'    => 'Categories',
		'keywords'      => 'Keywords',
		'blockTypes'    => 'Block Types',
		'postTypes'     => 'Post Types',
		'inserter'      => 'Inserter',
	);

	if ( ! $theme_path ) {
		$theme_path = get_template_directory();
	}

	$module_dir_path = module_dir_path( __FILE__ );

	// Grab all of the patterns in this theme.
	$pattern_file_paths = glob( $theme_path . '/patterns/*.php' );

	$patterns = array();

	foreach ( $pattern_file_paths as $path ) {
		$pattern_data = format_pattern_data( get_file_data( $path, $default_headers ), $path );
		if ( ! $pattern_data ) {
			continue;
		}
		$pattern_data['name']                  = basename( $path, '.php' );
		$pattern_data['type']                  = 'pattern';
		$patterns[ basename( $path, '.php' ) ] = $pattern_data;
	}

	return $patterns;
}

/**
 * Update a single pattern.
 *
 * @param array $pattern Data about the pattern.
 * @return bool
 */
function update_pattern( $pattern ) {

	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$wp_theme_dir = get_template_directory();

	if ( ! isset( $pattern['type'] ) || 'pattern' === $pattern['type'] ) {
		$patterns_dir     = $wp_theme_dir . '/patterns/';
		$name_was_changed = ! empty( $pattern['previousName'] ) && $pattern['previousName'] !== $pattern['name'];
		if ( $name_was_changed ) {
			// Delete the previous pattern file, as the file name should change on changing the name.
			$wp_filesystem->delete( $patterns_dir . sanitize_title( $pattern['previousName'] ) . '.php' );
		}

		$file_contents = contruct_pattern_php_file_contents( $pattern, 'pattern-manager' );
		$file_name     = sanitize_title( $pattern['name'] ) . '.php';
	}

	if ( 'template' === $pattern['type'] ) {
		$patterns_dir  = $wp_theme_dir . '/templates/';
		$file_contents = contruct_template_php_file_contents( $pattern, 'pattern-manager' );
		$file_name     = sanitize_title( $pattern['name'] ) . '.html';
	}

	if ( 'template_part' === $pattern['type'] ) {
		$patterns_dir  = $wp_theme_dir . '/parts/';
		$file_contents = contruct_template_php_file_contents( $pattern, 'pattern-manager' );
		$file_name     = sanitize_title( $pattern['name'] ) . '.html';
	}

	if ( ! $wp_filesystem->exists( $patterns_dir ) ) {
		$wp_filesystem->mkdir( $patterns_dir );
	}

	$pattern_file_created = $wp_filesystem->put_contents(
		$patterns_dir . $file_name,
		$file_contents,
		FS_CHMOD_FILE
	);

	return $pattern_file_created;
}

/**
 * Deletes any pattern file whose name isn't present in the passed patterns.
 *
 * @param string[] $patterns The patterns to not delete.
 */
function delete_patterns_not_present( array $patterns ) {
	$pattern_names = wp_list_pluck( array_values( $patterns ), 'name' );
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();
	if ( ! $wp_filesystem ) {
		return;
	}

	$pattern_file_paths = glob( get_template_directory() . '/patterns/*.php' );
	if ( ! $pattern_file_paths ) {
		return;
	}

	foreach ( $pattern_file_paths as $pattern_file ) {
		if ( ! in_array( basename( $pattern_file, '.php' ), $pattern_names, true ) ) {
			$wp_filesystem->delete( $pattern_file );
		}
	}
}

/**
 * Returns a string containing the code for a pattern file.
 *
 * @param array  $pattern Data about the pattern.
 * @param string $text_domain The text domain to use for any localization required.
 * @return bool
 */
function contruct_pattern_php_file_contents( $pattern, $text_domain ) {
	$pattern['content'] = remove_theme_name_from_template_parts( $pattern['content'] );
	$pattern['content'] = move_block_images_to_theme( $pattern['content'] );

	// phpcs:ignore
	$file_contents = "<?php
/**
 * Title: " . addcslashes( $pattern['title'], '\'' ) . '
 * Slug: ' . $pattern['name'] . '
 * Description: ' . $pattern['description'] . '
 * Categories: ' . ( isset( $pattern['categories'] ) ? implode( ', ', $pattern['categories'] ) : '' ) . '
 * Keywords: ' . ( isset( $pattern['keywords'] ) ? implode( ', ', $pattern['keywords'] ) : '' ) . '
 * Viewport Width: ' . ( $pattern['viewportWidth'] ? $pattern['viewportWidth'] : '1280' ) . '
 * Block Types: ' . ( isset( $pattern['blockTypes'] ) ? implode( ', ', $pattern['blockTypes'] ) : '' ) . '
 * Post Types: ' . ( isset( $pattern['postTypes'] ) ? implode( ', ', $pattern['postTypes'] ) : '' ) . '
 * Inserter: ' . ( $pattern['inserter'] ?? true ? 'true' : 'false' ) . '
 */

?>
' . trim( $pattern['content'] ) . '
';
	return $file_contents;
}

/**
 * Returns a string containing the code for a template file.
 *
 * @param array  $pattern Data about the pattern.
 * @param string $text_domain The text domain to use for any localization required.
 * @return bool
 */
function contruct_template_php_file_contents( $pattern, $text_domain ) {
	$pattern['content'] = remove_theme_name_from_template_parts( $pattern['content'] );
	return $pattern['content'];
}

/**
 * Scan all patterns in theme for images and other files, keep only ones actually being used.
 *
 * @param array $patterns_in_theme The patterns in the theme.
 */
function tree_shake_theme_images() {
	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	// Get the current patterns in the theme (not including templates and templates parts).
	// Important note: we are not pulling in images from templates and parts because they are html files, and thus cannot reference a local image.
	// Add the included Patterns for the current theme.
	$theme_dir         = get_template_directory();
	$patterns_in_theme = \PatternManager\PatternDataHandlers\get_theme_patterns();

	$backedup_images_dir = $wp_filesystem->wp_content_dir() . 'temp-images/';
	$images_dir          = $theme_dir . '/assets/images/';

	$wp_theme_url = get_template_directory_uri();
	$images_url   = $wp_theme_url . '/assets/images/';

	if ( ! $wp_filesystem->exists( $backedup_images_dir ) ) {
		$wp_filesystem->mkdir( $backedup_images_dir );
	}

	// Before we take any action, back up the current images directory.
	copy_dir( $images_dir, $backedup_images_dir );

	// Delete the images directory so we know it only contains what is needed.
	$wp_filesystem->delete( $images_dir, true, 'd' );

	if ( ! $wp_filesystem->exists( $images_dir ) ) {
		$wp_filesystem->mkdir( $images_dir );
	}

	// Loop through all patterns in the theme.
	foreach ( $patterns_in_theme as $pattern_data ) {
		// Find all URLs in the block pattern html.
		preg_match_all( '/(?<=")(http|https):\/\/(?:(?!").)*/', $pattern_data['content'], $output_array );

		// If no URLs were found in this pattern, skip to the next pattern.
		if ( ! isset( $output_array[0] ) ) {
			continue;
		}

		$urls_found = $output_array[0];

		$img_urls_found = $output_array['url'];

		// Loop through each URL found.
		foreach ( $urls_found as $url_found ) {

			// If URL to image is local to theme, pull it from the backed-up theme images directory.
			$local_path_to_image          = str_replace( $images_url, $backedup_images_dir, $url_found );
			$desired_destination_in_theme = str_replace( $backedup_images_dir, $images_dir, $local_path_to_image );

			// If the path to this image starts with the path to our backedup images directory.
			if ( strpos( $local_path_to_image, $backedup_images_dir ) === 0 ) {
				// Move the file into the theme again.
				$wp_filesystem->copy( $local_path_to_image, $desired_destination_in_theme );
			}
		}
	}

	// Delete the temporary backup of the images we did.
	$wp_filesystem->delete( $backedup_images_dir, true, 'd' );
}

/**
 * Scan blocks for images and other files, and move them into the theme as assets.
 *
 * @param string $pattern_html The pattern HTML code, generated by Gutenberg functions.
 * @return $string The modified block HTML with absolute URLs changed to be localized to the theme.
 */
function move_block_images_to_theme( $pattern_html ) {

	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$wp_theme_dir = get_template_directory();
	$assets_dir   = $wp_theme_dir . '/assets/';
	$images_dir   = $wp_theme_dir . '/assets/images/';

	$wp_theme_url = get_template_directory_uri();
	$images_url   = $wp_theme_url . '/assets/images/';

	if ( ! $wp_filesystem->exists( $assets_dir ) ) {
		$wp_filesystem->mkdir( $assets_dir );
	}

	if ( ! $wp_filesystem->exists( $images_dir ) ) {
		$wp_filesystem->mkdir( $images_dir );
	}

	// Find all URLs in the block pattern html.
	preg_match_all( '/(?<=")(http|https):\/\/(?:(?!").)*/', $pattern_html, $output_array );
	$urls_found = $output_array[0];

	// Loop through each img URL found.
	foreach ( $urls_found as $url_found ) {
		$url_details = wp_remote_get(
			$url_found,
			array(
				'sslverify' => false,
			)
		);

		$response = wp_remote_retrieve_response_code( $url_details );

		// Skip images that could not be found by their URL.
		if ( 200 !== absint( $response ) ) {
			continue;
		}

		$type = wp_remote_retrieve_header( $url_details, 'Content-Type' );

		// Skip URLs that are not images by checking the content-type contains "image" (image/png, image/jpg, etc).
		if ( strpos( $type, 'image' ) === false ) {
			continue;
		}

		$file_contents = wp_remote_retrieve_body( $url_details );

		// Remove any URL query vars from the filename.
		$url_parts = explode( '?', $url_found );
		$filename  = basename( $url_parts[0] );

		// Save this to the theme.
		$file_saved = $wp_filesystem->put_contents(
			$wp_theme_dir . '/assets/images/' . $filename,
			$file_contents,
			FS_CHMOD_FILE
		);

		// Replace the URL with the one we just added to the theme.
		$pattern_html = str_replace( $url_found, "<?php echo get_template_directory_uri(); ?>/assets/images/$filename", $pattern_html );
	}

	return $pattern_html;
}
