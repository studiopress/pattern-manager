<?php
/**
 * Module Name: Editor
 * Namespace: Editor
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\Editor;

use WP_Query;
use function PatternManager\PatternDataHandlers\get_pattern_by_name;
use function PatternManager\PatternDataHandlers\get_theme_patterns;
use function PatternManager\PatternDataHandlers\update_pattern;

/**
 * Gets the pattern post type.
 *
 * @return string
 */
function get_pattern_post_type(): string {
	return 'pm_pattern';
}

/**
 * Gets the new pattern number.
 *
 * @param string $name The new pattern name.
 * @param array<string, mixed> $all_patterns All the patterns.
 * @return int The new pattern number.
 */
function get_new_pattern_number( string $name, array $all_patterns ): int {
	if ( ! isset( $all_patterns[ $name ] ) ) {
		return 0;
	}

	$number_of_patterns = count( $all_patterns );
	for ( $i = 1; $i <= $number_of_patterns; $i++ ) {
		if ( ! isset( $all_patterns[ "{$name}-{$i}" ] ) ) {
			return $i;
		}
	}

	return $i + 1;
}

/**
 * Gets a duplicate pattern.
 *
 * @param string $name The pattern name
 * @param array $all_patterns All the patterns.
 * @return array {
 *   'name'  => string,
 *   'slug'  => string,
 *   'title' => string,
 * } | null
 */
function get_duplicate_pattern_ids( string $name, array $all_patterns ) {
	$pattern_to_duplicate = $all_patterns[ $name ] ?? null;
	if ( ! $pattern_to_duplicate ) {
		return null;
	}

	$base_name      = "{$pattern_to_duplicate['name']}-copied";
	$base_title     = "{$pattern_to_duplicate['title']} (copied)";
	$pattern_number = get_new_pattern_number( $base_name, $all_patterns );

	return array(
		'name'  => $pattern_number ? "{$base_name}-{$pattern_number}" : $base_name,
		'slug'  => $pattern_number ? "{$base_name}-{$pattern_number}" : $base_name,
		'title' => $pattern_number ? "{$base_title} {$pattern_number}" : $base_title,
	);
}

/**
 * Gets a new pattern.
 *
 * @param array $all_patterns All the patterns.
 * @return string The new pattern title.
 */
function get_new_pattern_title( array $all_patterns ): string {
	$number = get_new_pattern_number( 'my-new-pattern', $all_patterns );
	return $number ? "My New Pattern {$number}" : 'My New Pattern';
}

/**
 * Gets the pm_pattern post IDs.
 *
 * @return int[]
 */
function get_pm_post_ids() {
	return ( new WP_Query(
		[
			'post_type'      => get_pattern_post_type(),
			'post_status'    => 'any',
			'fields'         => 'ids',
			'posts_per_page' => 10,
		]
	) )->posts;
}

/**
 * Duplicates a pattern.
 *
 * @param string $pattern_name The pattern name to duplicate.
 */
function duplicate_pattern( string $pattern_name ) {
	$pattern_to_duplicate  = get_pattern_by_name( sanitize_text_field( $pattern_name ) );
	$duplicate_pattern_ids = get_duplicate_pattern_ids( $pattern_to_duplicate['name'], get_theme_patterns() );
	if ( ! $duplicate_pattern_ids ) {
		return;
	}

	$new_pattern = array_merge(
		$pattern_to_duplicate,
		$duplicate_pattern_ids
	);

	update_pattern( $new_pattern );

	wp_safe_redirect(
		get_edit_post_link(
			wp_insert_post(
				[
					'post_type'   => get_pattern_post_type(),
					'post_name'   => $new_pattern['name'],
					'post_status' => 'publish',
				]
			),
			'direct_link'
		)
	);
}

/**
 * Goes to the editor for a pattern.
 *
 * @param string $pattern_name The pattern name.
 */
function edit_pattern( string $pattern_name ) {
	wp_safe_redirect(
		get_edit_post_link(
			wp_insert_post(
				[
					'post_type'   => get_pattern_post_type(),
					'post_name'   => sanitize_text_field( $pattern_name ),
					'post_status' => 'publish',
				]
			),
			'direct_link'
		)
	);
}

/**
 * Updates pattern slugs in Pattern Blocks.
 *
 * If a pattern changes slugs,
 * and a Pattern Block references its old slug,
 * it won't render.
 *
 * @param string $old_slug The previous slug.
 * @param string $new_slug The new slug.
 */
function update_pattern_slugs( $old_slug, $new_slug ) {
	$patterns = get_theme_patterns();

	foreach ( $patterns as $pattern_name => $pattern ) {
		if ( has_pattern_block( $pattern['content'] ) ) {
			update_pattern(
				array_merge(
					$pattern,
					[ 'content' => update_slug( $old_slug, $new_slug, $pattern['content'] ) ],
				)
			);
		}
	}
}

/**
 * Updates a slug in a Pattern Block to a new slug.
 *
 * @param string $old_slug The previous slug.
 * @param string $new_slug The new slug.
 * @param string $subject What to replace the slug in.
 * @return string With the updated slug.
 */
function update_slug( $old_slug, $new_slug, $subject ) {
	return preg_replace(
		'#(<!--\s+wp:pattern\s+{[^}]*"slug":")(' . $old_slug . ')(")#',
		'${1}' . $new_slug . '${3}',
		$subject
	);
}

/**
 * Gets whether content has a Pattern Block.
 *
 * @param string $content The content to examine.
 * @return bool Whether the content has a pattern block.
 */
function has_pattern_block( $content ) {
	return 1 === preg_match(
		'#<!--\s+wp:pattern\s+{[^}]*"slug":"#',
		$content
	);
}

/**
 * Prepends the theme textdomain to a pattern name.
 * <textdomain>/<pattern-name>
 *
 * @param string $name The pattern name.
 * @return string
 */
function prepend_textdomain( $name ) {
	return implode(
		'/',
		array_filter( [ wp_get_theme()->get( 'TextDomain' ), $name ] )
	);
}
