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
function get_new_pattern_number( $name, $all_patterns ) {
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
