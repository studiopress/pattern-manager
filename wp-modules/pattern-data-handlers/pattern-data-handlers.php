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
 * Get the pattern data for all patterns in a theme.
 *
 * @return array
 */
function get_theme_patterns() {
	$patterns = array();

	// Grab all the patterns in this theme.
	$pattern_file_paths = get_pattern_file_paths();

	foreach ( $pattern_file_paths as $path ) {
		$pattern = get_pattern_by_path( $path );
		if ( $pattern ) {
			$patterns[ $pattern['name'] ] = $pattern;
		}
	}

	return $patterns;
}

/**
 * Gets the directory the patterns are in.
 *
 * @return string
 */
function get_patterns_directory() {
	return get_template_directory() . '/patterns/';
}

/**
 * Gets the file paths for patterns.
 *
 * @return array|false
 */
function get_pattern_file_paths() {
	return glob( get_patterns_directory() . '*.php' );
}

/**
 * Gets a pattern by its path in the filesystem.
 *
 * @param string $path The pattern path.
 * @return array|false The pattern, if any.
 */
function get_pattern_by_path( $path ) {
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

	$pattern_data = format_pattern_data( get_file_data( $path, $default_headers ), $path );
	if ( ! $pattern_data ) {
		return false;
	}
	$pattern_data['name'] = basename( $path, '.php' );

	return $pattern_data;
}

/**
 * Gets a pattern by the name in the query param.
 *
 * @return array|null The pattern for the editor.
 */
function get_pattern_from_query_param() {
	$pattern_name = filter_input( INPUT_GET, 'name' );
	return get_pattern_by_name( urldecode( sanitize_text_field( $pattern_name ) ) );
}

/**
 * Gets a pattern by its name.
 *
 * @param string $name The pattern name.
 * @return array|false
 */
function get_pattern_by_name( $name ) {
	$pattern_path = get_patterns_directory() . $name . '.php';

	return file_exists( $pattern_path )
		? get_pattern_by_path( $pattern_path )
		: false;
}

/**
 * Gets all the pattern names.
 *
 * @return string[] The pattern names.
 */
function get_pattern_names() {
	return array_map(
		function( $path ) {
			return basename( $path, '.php' );
		},
		get_pattern_file_paths()
	);
}

/**
 * Update a single pattern.
 *
 * @param array $pattern Data about the pattern.
 * @return bool
 */
function update_pattern( array $pattern ): bool {
	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$patterns_dir     = get_patterns_directory();
	$name_was_changed = ! empty( $pattern['previousName'] ) && $pattern['previousName'] !== $pattern['name'];
	if ( $name_was_changed ) {
		// Delete the previous pattern file, as the file name should change on changing the name.
		$wp_filesystem->delete( $patterns_dir . sanitize_title( $pattern['previousName'] ) . '.php' );
	}

	$file_contents = construct_pattern_php_file_contents( $pattern, 'pattern-manager' );
	$file_name     = sanitize_title( $pattern['name'] ) . '.php';

	if ( ! $wp_filesystem->exists( $patterns_dir ) ) {
		$wp_filesystem->mkdir( $patterns_dir );
	}

	return $wp_filesystem->put_contents(
		$patterns_dir . $file_name,
		$file_contents,
		FS_CHMOD_FILE
	);
}

/**
 * Updates only 1 pattern and does tree shaking.
 *
 * @param array $pattern The pattern to update.
 */
function update_single_pattern_with_tree_shaking( array $pattern ) {
	$is_success = update_pattern( $pattern );
	tree_shake_single_pattern_with_backup( $pattern );

	return $is_success;
}

/**
 * Updates all patterns and does tree shaking.
 *
 * @param array $patterns The new patterns.
 * @return bool Whether all patterns updated.
 */
function update_patterns_with_tree_shaking( array $patterns ): bool {
	delete_patterns_not_present( $patterns );

	$results = array_map(
		function( $pattern ) {
			return update_pattern( $pattern );
		},
		$patterns
	);

	// Now that all patterns have been saved, remove any images no longer needed in the theme.
	tree_shake_patterns_with_backup();

	return ! in_array( false, $results, true );
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

	$pattern_file_paths = get_pattern_file_paths();
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
 * WordPress's template part block adds a "theme" attribute, which can be incorrect if the template part was copied from another theme.
 * This function removes that attribute from any template part blocks in a pattern's content.
 *
 * @param string $pattern_content The HTML content for a pattern..
 * @return string
 */
function remove_theme_name_from_template_parts( $pattern_content ) {

	// Find all references to "theme":"anything" and remove them, as we want blocks to work with any theme they are inside of.
	return preg_replace( '/,"theme":"[A-Za-z-]*"/', ',"theme":"' . basename( get_template_directory() ) . '"', $pattern_content );
}

/**
 * Returns a string containing the code for a pattern file.
 *
 * @param array  $pattern Data about the pattern.
 * @param string $text_domain The text domain to use for any localization required.
 * @return bool
 */
function construct_pattern_php_file_contents( $pattern, $text_domain ) {
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
 * Scans a single pattern in the theme for images and other files, keep only ones actually being used.
 *
 * @param array $pattern The pattern to tree shake.
 */
function tree_shake_single_pattern_with_backup( array $pattern ) {
	if ( ! isset( $pattern['name'] ) ) {
		return;
	}

	$backed_up_images_dir = back_up_images();
	_tree_shake_pattern( get_pattern_by_name( $pattern['name'] ), $backed_up_images_dir );

	// Delete the temporary backup of the images we did.
	\PatternManager\GetWpFilesystem\get_wp_filesystem_api()->delete( $backed_up_images_dir, true, 'd' );
}

/**
 * Scans all patterns in the theme for images and other files, keep only ones actually being used.
 */
function tree_shake_patterns_with_backup() {
	$backed_up_images_dir = back_up_images();

	// Get the current patterns in the theme (not including templates and templates parts).
	// Add the included Patterns for the current theme.
	foreach ( get_theme_patterns() as $pattern_data ) {
		_tree_shake_pattern( $pattern_data, $backed_up_images_dir );
	}

	// Delete the temporary backup of the images we did.
	\PatternManager\GetWpFilesystem\get_wp_filesystem_api()->delete( $backed_up_images_dir, true, 'd' );
}

/**
 * Backs up the images that will be tree shaken.
 *
 * @return string The directory of the backed up images.
 */
function back_up_images(): string {
	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$backed_up_images_dir = $wp_filesystem->wp_content_dir() . 'temp-images/';
	$images_dir           = get_theme_images_directory();

	if ( ! $wp_filesystem->exists( $backed_up_images_dir ) ) {
		$wp_filesystem->mkdir( $backed_up_images_dir );
	}

	// Before we take any action, back up the current images directory.
	copy_dir( $images_dir, $backed_up_images_dir );

	// Delete the images directory so we know it only contains what is needed.
	$wp_filesystem->delete( $images_dir, true, 'd' );

	if ( ! $wp_filesystem->exists( $images_dir ) ) {
		$wp_filesystem->mkdir( $images_dir, $backed_up_images_dir );
	}

	return $backed_up_images_dir;
}

/**
 * Gets the theme images directory.
 *
 * @return string
 */
function get_theme_images_directory(): string {
	return get_template_directory() . '/assets/images/';
}

/**
 * Tree shakes a single pattern.
 *
 * @param array $pattern_data The pattern to tree shake.
 * @param string $backed_up_images_dir The directory of the images backup.
 */
function _tree_shake_pattern( array $pattern_data, string $backed_up_images_dir ) {
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	// Find all URLs in the block pattern html.
	preg_match_all( '/(?<=")(http|https):\/\/(?:(?!").)*/', $pattern_data['content'], $output_array );

	// If no URLs were found in this pattern, skip to the next pattern.
	if ( ! isset( $output_array[0] ) ) {
		return;
	}

	$urls_found = $output_array[0];

	$images_url = get_template_directory_uri() . '/assets/images/';
	$images_dir = get_theme_images_directory();

	// Loop through each URL found.
	foreach ( $urls_found as $url_found ) {

		// If URL to image is local to theme, pull it from the backed-up theme images directory.
		$local_path_to_image          = str_replace( $images_url, $backed_up_images_dir, $url_found );
		$desired_destination_in_theme = str_replace( $backed_up_images_dir, $images_dir, $local_path_to_image );

		// If the path to this image starts with the path to our backedup images directory.
		if ( strpos( $local_path_to_image, $backed_up_images_dir ) === 0 ) {
			// Move the file into the theme again.
			$wp_filesystem->copy( $local_path_to_image, $desired_destination_in_theme );
		}
	}
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
		$pattern_html = str_replace( $url_found, "<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/$filename", $pattern_html );
	}

	return $pattern_html;
}
