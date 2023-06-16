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

use WP_Query;
use function PatternManager\Editor\get_pattern_post_type;

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
	foreach ( array( 'categories', 'keywords', 'blockTypes', 'postTypes', 'customCategories' ) as $property ) {
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

	wp_opcache_invalidate( $file );

	// The actual pattern content is the output of the file.
	ob_start();
	include $file;
	$pattern_data['content'] = ob_get_clean();

	return $pattern_data;
}

/**
 * Get the pattern data for all patterns in a theme.
 *
 * @return array
 */
function get_theme_patterns(): array {
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
 * Get the pattern data with links to the editor.
 *
 * @return array
 */
function get_theme_patterns_with_editor_links() {
	$all_patterns = get_theme_patterns();
	foreach ( $all_patterns as $pattern_name => $pattern ) {
		if ( $pattern ) {
			$query = new WP_Query(
				[
					'post_type'      => get_pattern_post_type(),
					'post_name'      => $pattern['name'],
					'post_status'    => 'publish',
					'posts_per_page' => 1,
				]
			);
			$post  = empty( $query->posts[0] ) ? false : $query->posts[0];

			$pattern['editorLink'] = $post && $post->name === $pattern['name']
				? get_edit_post_link( $post, 'localized_data' )
				: add_query_arg(
					[
						'post_type' => get_pattern_post_type(),
						'action'    => 'edit-pattern',
						'name'      => $pattern['name'],
					],
					admin_url()
				);

			$all_patterns[ $pattern_name ] = $pattern;
		}
	}

	return $all_patterns;
}

/**
 * Gets the directory the patterns are in.
 *
 * @return string
 */
function get_patterns_directory() {
	return get_stylesheet_directory() . '/patterns/';
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
		'title'            => 'Title',
		'slug'             => 'Slug',
		'description'      => 'Description',
		'viewportWidth'    => 'Viewport Width',
		'categories'       => 'Categories',
		'keywords'         => 'Keywords',
		'blockTypes'       => 'Block Types',
		'postTypes'        => 'Post Types',
		'inserter'         => 'Inserter',
		'customCategories' => 'Custom Categories',
	);

	$pattern_data = format_pattern_data( get_file_data( $path, $default_headers ), $path );
	if ( ! $pattern_data ) {
		return false;
	}

	return array_merge( $pattern_data, array( 'name' => basename( $path, '.php' ) ) );
}

/**
 * Gets the default values for a pattern.
 *
 * @return array
 */
function get_pattern_defaults() {
	return [
		'name'             => '',
		'title'            => '',
		'description'      => '',
		'content'          => '',
		'viewportWidth'    => 1280,
		'categories'       => [],
		'keywords'         => [],
		'blockTypes'       => [],
		'postTypes'        => [],
		'inserter'         => true,
		'customCategories' => [],
	];
}

/**
 * Gets a pattern by its name.
 *
 * @param string $name The pattern name.
 * @return array|false
 */
function get_pattern_by_name( $name ) {
	$pattern_path = get_pattern_path( $name );

	return file_exists( $pattern_path )
		? get_pattern_by_path( $pattern_path )
		: false;
}

/**
 * Gets the path to a pattern.
 *
 * @param string $name The pattern name.
 * @return string The absolute pattern path.
 */
function get_pattern_path( string $name ): string {
	return get_patterns_directory() . $name . '.php';
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
 * Update or create a single pattern.
 *
 * @param array $pattern Data about the pattern.
 * @return bool
 */
function update_pattern( $pattern ) {
	// Spin up the filesystem api.
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$patterns_dir  = get_patterns_directory();
	$file_contents = construct_pattern_php_file_contents( $pattern );
	$file_name     = sanitize_title( $pattern['name'] ) . '.php';

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
 * Deletes a pattern.
 *
 * @param string $pattern_name The pattern name to delete.
 * @return bool Whether the deletion succeeded.
 */
function delete_pattern( string $pattern_name ): bool {
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();
	$pattern_path  = get_pattern_path( $pattern_name );
	return $wp_filesystem && $wp_filesystem->exists( $pattern_path ) && $wp_filesystem->delete( $pattern_path );
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
	return preg_replace( '/,"theme":"[A-Za-z-]*"/', ',"theme":"' . basename( get_stylesheet_directory() ) . '"', $pattern_content );
}

/**
 * Returns a string containing the code for a pattern file.
 *
 * @param array $pattern_data Data about the pattern.
 * @return string
 */
function construct_pattern_php_file_contents( $pattern_data ) {
	$pattern            = wp_parse_args( $pattern_data, get_pattern_defaults() );
	$pattern['content'] = remove_theme_name_from_template_parts( $pattern['content'] );
	$pattern['content'] = move_block_images_to_theme( $pattern['content'] );

	$file_contents = '<?php
/**
 * Title: ' . addcslashes( $pattern['title'], '\'' ) . '
 * Slug: ' . $pattern['slug'] . '
 * Description: ' . $pattern['description'] . '
 * Categories: ' . implode( ', ', $pattern['categories'] ) . '
 * Keywords: ' . implode( ', ', $pattern['keywords'] ) . '
 * Viewport Width: ' . $pattern['viewportWidth'] . '
 * Block Types: ' . implode( ', ', $pattern['blockTypes'] ) . '
 * Post Types: ' . implode( ', ', $pattern['postTypes'] ) . '
 * Inserter: ' . ( $pattern['inserter'] ? 'true' : 'false' ) . maybe_add_custom_category_header( $pattern['customCategories'] ) . '
 */' . create_formatted_category_registrations( $pattern['customCategories'] ) . '
?>
' . trim( $pattern['content'] ) . '
';
	return $file_contents;
}

/**
 * Returns a string that conditionally contains the custom category header.
 *
 * @param array $custom_categories The custom category titles/labels.
 * @return string
 */
function maybe_add_custom_category_header( $custom_categories ) {
	return ! empty( $custom_categories ) ? "\n * Custom Categories: " . implode( ', ', $custom_categories ) : '';
}

/**
 * Returns a formatted string that will register custom categories from the pattern file.
 *
 * @param array $custom_categories The custom category titles/labels to be parsed.
 * @return string
 */
function create_formatted_category_registrations( $custom_categories ) {
	if ( empty( $custom_categories ) ) {
		return '';
	}

	return "\n" . implode(
		"\n",
		array_map(
			function ( $category_label ) {
				$category_name = strtolower( str_replace( ' ', '-', $category_label ) );
				$text_domain   = wp_get_theme()->get( 'TextDomain' );
				$label_arr     = $text_domain ? "[ 'label' => __( '$category_label', '$text_domain' ), 'pm_custom' => true ]" : "[ 'label' => '$category_label', , 'pm_custom' => true ]";
				return "register_block_pattern_category( '$category_name', $label_arr );";
			},
			$custom_categories,
		)
	);
}

/**
 * Scan all patterns in theme for images and other files, keep only ones actually being used.
 *
 * @param object $wp_filesystem The file system.
 * @param callable $copy_dir Copies a directory.
 */
function tree_shake_theme_images( $wp_filesystem, $copy_dir ) {
	// Get the current patterns in the theme (not including templates and templates parts).
	// Important note: we are not pulling in images from templates and parts because they are html files, and thus cannot reference a local image.
	// Add the included Patterns for the current theme.
	$theme_dir         = get_stylesheet_directory();
	$patterns_in_theme = \PatternManager\PatternDataHandlers\get_theme_patterns();

	$backedup_images_dir = $wp_filesystem->wp_content_dir() . 'temp-images/';
	$images_dir          = $theme_dir . '/patterns/images/';

	$wp_theme_url = get_stylesheet_directory_uri();
	$images_url   = $wp_theme_url . '/patterns/images/';

	if ( ! $wp_filesystem->exists( $backedup_images_dir ) ) {
		$wp_filesystem->mkdir( $backedup_images_dir );
	}

	// Before we take any action, back up the current images directory.
	call_user_func( $copy_dir, $images_dir, $backedup_images_dir );

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

		$img_urls_found = $output_array['url'] ?? [];

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
	if ( ! $wp_filesystem ) {
		return $pattern_html;
	}

	$wp_theme_dir = get_stylesheet_directory();
	$assets_dir   = $wp_theme_dir . '/assets/';
	$images_dir   = $wp_theme_dir . '/patterns/images/';

	$wp_theme_url = get_stylesheet_directory_uri();
	$images_url   = $wp_theme_url . '/patterns/images/';

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
			$wp_theme_dir . '/patterns/images/' . $filename,
			$file_contents,
			FS_CHMOD_FILE
		);

		// Replace the URL with the one we just added to the theme.
		$pattern_html = str_replace( $url_found, "<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/patterns/images/$filename", $pattern_html );
	}

	return $pattern_html;
}
