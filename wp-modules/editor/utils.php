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
 * Gets an ID of a post that has a comment.
 *
 * @return int|null
 */
function get_post_id_with_comment() {
	return ( new WP_Query(
		[
			'comment_count'  => [
				'value'   => 0,
				'compare' => '>',
			],
			'posts_per_page' => 1,
			'fields'         => 'ids',
		]
	) )->posts[0] ?? null;
}
