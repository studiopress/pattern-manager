<?php
/**
 * Module Name: Pattern Post Type
 * Namespace: PatternPostType
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\PatternPostType;

/**
 * Gets the new pattern number.
 *
 * @param string $name The new pattern name.
 * @param array $all_patterns All the patterns.
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
 * @return array|null The duplicated pattern name, slug, and title.
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
