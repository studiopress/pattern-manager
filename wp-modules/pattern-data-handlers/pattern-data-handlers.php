<?php
/**
 * Module Name: Pattern Data Handlers
 * Description: This module contains functions for getting and saving pattern data.
 * Namespace: PatternDataHandlers
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\PatternDataHandlers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * A the data for a single pattern.
 *
 * @param string $pattern_id The name of the pattern to get.
 * @return array
 */
function get_pattern( $pattern_id ) {
	$patterns_data = get_patterns();
	if ( ! isset( $patterns_data[ $pattern_id ] ) ) {
		return false;
	}

	$pattern_data = $patterns_data[ $pattern_id ];

	return $pattern_data;
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
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();
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
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();
	if ( empty( $pattern_data['slug'] ) ) {
		_doing_it_wrong(
			'_register_theme_block_patterns',
			sprintf(
				/* translators: %s: file name. */
				esc_html( __( 'Could not register file "%s" as a block pattern ("Slug" field missing)', 'fse-studio' ) ),
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
				esc_html( __( 'Could not register file "%1$s" as a block pattern (invalid slug "%2$s")', 'fse-studio' ) ),
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
				esc_html( __( 'Could not register file "%s" as a block pattern ("Title" field missing)', 'fse-studio' ) ),
				esc_html( $file )
			),
			'6.0.0'
		);
		return false;
	}

	// For properties of type array, parse data as comma-separated.
	foreach ( array( 'categories', 'keywords', 'blockTypes', 'postTypes' ) as $property ) {
		if ( ! empty( $pattern_data[ $property ] ) ) {
			$pattern_data[ $property ] = array_filter(
				preg_split(
					'/[\s,]+/',
					(string) $pattern_data[ $property ]
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
			$pattern_data[ $property ] = in_array(
				strtolower( $pattern_data[ $property ] ),
				array( 'yes', 'true' ),
				true
			);
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

	$file_contents = explode( '?>', $wp_filesystem->get_contents( $file ), 2 );

	// Replace PHP calls to get_template_directory_uri with the result of calling it. This is how it is because PHP's require is cached, forcing us to use get_contents instead.
	$pattern_data['content'] = str_replace( '<?php echo get_template_directory_uri(); ?>', get_template_directory_uri(), $file_contents[1] );

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
		return false;
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
 * Get the data for all templates in a theme.
 *
 * @param string $theme_path The path to the theme.
 * @return array
 */
function get_theme_templates( $theme_path = false ) {
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	if ( ! $theme_path ) {
		$theme_path = get_template_directory();
	}

	$module_dir_path = module_dir_path( __FILE__ );

	// Grab all of the templates in this theme.
	$pattern_file_paths = glob( $theme_path . '/templates/*.html' );

	$templates = array();

	foreach ( $pattern_file_paths as $path ) {
		$block_pattern_html = $wp_filesystem->get_contents( $path );

		$template_data = array(
			'type'    => 'template',
			// Translators: The name of the theme template in question.
			'title'   => sprintf( __( '%s Template', 'fse-studio' ), ucfirst( basename( $path, '.html' ) ) ),
			'name'    => basename( $path, '.html' ),
			'content' => $block_pattern_html,
		);

		$templates[ basename( $path, '.html' ) ] = $template_data;
	}

	return $templates;
}

/**
 * Get the data for all template parts in a theme.
 *
 * @param string $theme_path The path to the theme.
 * @return array
 */
function get_theme_template_parts( $theme_path = false ) {
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	if ( ! $theme_path ) {
		$theme_path = get_template_directory();
	}

	$module_dir_path = module_dir_path( __FILE__ );

	// Grab all of the templates in this theme.
	$pattern_file_paths = glob( $theme_path . '/parts/*.html' );

	$templates = array();

	foreach ( $pattern_file_paths as $path ) {
		$block_pattern_html = $wp_filesystem->get_contents( $path );

		$template_data = array(
			'type'    => 'template_part',
			// Translators: The name of the theme template in question.
			'title'   => sprintf( __( '%s Template Part', 'fse-studio' ), ucfirst( basename( $path, '.html' ) ) ),
			'name'    => basename( $path, '.html' ),
			'content' => $block_pattern_html,
		);

		$templates[ basename( $path, '.html' ) ] = $template_data;
	}

	return $templates;
}

/**
 * Update a single pattern.
 *
 * @param array $pattern Data about the pattern.
 * @return bool
 */
function update_pattern( $pattern ) {

	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$wp_theme_dir = get_template_directory();

	if ( ! isset( $pattern['type'] ) || 'pattern' === $pattern['type'] ) {
		$patterns_dir     = $wp_theme_dir . '/patterns/';
		$name_was_changed = ! empty( $pattern['previousName'] ) && $pattern['previousName'] !== $pattern['name'];
		if ( $name_was_changed ) {
			// Delete the previous pattern file, as the file name should change on changing the name.
			$wp_filesystem->delete( $patterns_dir . sanitize_title( $pattern['previousName'] ) . '.php' );
		}

		$file_contents = contruct_pattern_php_file_contents( $pattern, 'fse-studio' );
		$file_name     = sanitize_title( $pattern['name'] ) . '.php';
	}

	if ( 'template' === $pattern['type'] ) {
		$patterns_dir  = $wp_theme_dir . '/templates/';
		$file_contents = contruct_template_php_file_contents( $pattern, 'fse-studio' );
		$file_name     = sanitize_title( $pattern['name'] ) . '.html';
	}

	if ( 'template_part' === $pattern['type'] ) {
		$patterns_dir  = $wp_theme_dir . '/parts/';
		$file_contents = contruct_template_php_file_contents( $pattern, 'fse-studio' );
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

	// Now that this pattern has been updated, remove any images no longer needed in the theme.
	// This is done here in update_pattern because an image may no longer be used in the pattern and thus needs to be removed from the theme.
	tree_shake_theme_images();

	return $pattern_file_created;
}

/**
 * Deletes any pattern file whose name isn't present in the passed patterns.
 *
 * @param string[] $patterns The patterns to not delete.
 */
function delete_patterns_not_present( array $patterns ) {
	$pattern_names = wp_list_pluck( array_values( $patterns ), 'name' );
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();
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
function contruct_pattern_php_file_contents( $pattern, $text_domain ) {
	$pattern['content'] = remove_theme_name_from_template_parts( $pattern['content'] );
	$pattern['content'] = move_block_images_to_theme( $pattern['content'] );
	$pattern['content'] = prepare_content( $pattern['content'], $text_domain );

	// phpcs:ignore
	$file_contents = "<?php
/**
 * Title: " . addcslashes( $pattern['title'], '\'' ) . '
 * Slug: ' . $pattern['name'] . '
 * Categories: ' . ( isset( $pattern['categories'] ) ? implode( ', ', $pattern['categories'] ) : '' ) . '
 * Viewport Width: ' . ( $pattern['viewportWidth'] ? $pattern['viewportWidth'] : '1280' ) . '
 * Block Types: ' . ( isset( $pattern['blockTypes'] ) ? implode( ', ', $pattern['blockTypes'] ) : '' ) . '
 * Post Types: ' . ( isset( $pattern['postTypes'] ) ? implode( ', ', $pattern['postTypes'] ) : '' ) . '
 */

?>
' . $pattern['content'] . '
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
	$pattern['content'] = prepare_content( $pattern['content'], $text_domain );
	return $pattern['content'];
}

/**
 * Prepare pattern html to be written into a file.
 *
 * @param string $pattern_html The pattern HTML code, generated by Gutenberg functions.
 * @param string $text_domain The text domain to use for any localization required.
 * @return bool
 */
function prepare_content( $pattern_html, $text_domain ) {
	$pattern_html = addcslashes( $pattern_html, '\'' );
	return $pattern_html;
}

/**
 * Scan all patterns in theme for images and other files, keep only ones actually being used.
 *
 * @param array $patterns_in_theme The patterns in the theme.
 */
function tree_shake_theme_images() {
	// Spin up the filesystem api.
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	// Get the current patterns in the theme (not including templates and templates parts).
	// Important note: we are not pulling in images from templates and parts because they are html files, and thus cannot reference a local image.
	// Add the included Patterns for the current theme.
	$theme_dir         = get_template_directory();
	$patterns_in_theme = \FseStudio\PatternDataHandlers\get_theme_patterns();

	$backedup_images_dir = $wp_filesystem->wp_content_dir() . 'temp-images/';
	$images_dir          = $theme_dir . '/assets/images/';

	$wp_theme_url        = get_template_directory_uri();
	$backedup_images_url = content_url() . '/temp-images/';
	$images_url          = $wp_theme_url . '/assets/images/';

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
		preg_match_all( '/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:;\/~+#-]*[\w@?^=%&\/~+#-])/', $pattern_data['content'], $output_array );
		$urls_found = $output_array[0];

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
	$wp_filesystem = \FseStudio\GetWpFilesystem\get_wp_filesystem_api();

	$wp_theme_dir = get_template_directory();
	$images_dir   = $wp_theme_dir . '/assets/images/';

	$wp_theme_url = get_template_directory_uri();
	$images_url   = $wp_theme_url . '/assets/images/';

	if ( ! $wp_filesystem->exists( $images_dir ) ) {
		$wp_filesystem->mkdir( $images_dir );
	}

	// Find all URLs in the block pattern html.
	preg_match_all( '/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:;\/~+#-]*[\w@?^=%&\/~+#-])/', $pattern_html, $output_array );
	$urls_found = $output_array[0];

	// Loop through each URL found.
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

		$file_contents = wp_remote_retrieve_body( wp_remote_get( $url_found ) );

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

/**
 * When a wp_template post is saved, save it to the theme file.
 *
 * @param WP_Post         $post The Post that was updated.
 * @param WP_REST_Request $request The Post that was updated.
 * @param bool            $creating True when creating a post, false when updating.
 */
function handle_wp_template_save( $post, $request, $creating ) {
	if ( ! $request->get_param( 'id' ) ) {
		return;
	}

	$template_name    = explode( '//', $request->get_param( 'id' ) )[1];
	$template_content = $request->get_param( 'content' );

	$block_pattern_data = array(
		'type'          => 'template',
		'title'         => $template_name,
		'name'          => $template_name,
		'categories'    => array(),
		'blockTypes'    => array(),
		'postTypes'     => array(),
		'viewportWidth' => 1280,
		'content'       => $template_content,
	);

	update_pattern( $block_pattern_data );
}
add_action( 'rest_after_insert_wp_template', __NAMESPACE__ . '\handle_wp_template_save', 10, 3 );


/**
 * When a wp_template_part post is saved, save it to the theme file.
 *
 * @param WP_Post         $post The Post that was updated.
 * @param WP_REST_Request $request The Post that was updated.
 * @param bool            $creating True when creating a post, false when updating.
 */
function handle_wp_template_part_save( $post, $request, $creating ) {
	if ( $request->get_param( 'id' ) ) {
		$template_name = explode( '//', $request->get_param( 'id' ) )[1];
	} else {
		$template_name = $request->get_param( 'title' );
	}
	$template_content = $request->get_param( 'content' );

	$block_pattern_data = array(
		'type'          => 'template_part',
		'title'         => $template_name,
		'name'          => $template_name,
		'categories'    => array(),
		'viewportWidth' => 1280,
		'content'       => $template_content,
	);

	update_pattern( $block_pattern_data );
}
add_action( 'rest_after_insert_wp_template_part', __NAMESPACE__ . '\handle_wp_template_part_save', 10, 3 );
