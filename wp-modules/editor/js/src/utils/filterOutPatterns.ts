import { parse } from '@wordpress/blocks';
import hasBlock from './hasBlock';
import type { Pattern, Patterns } from '../types';

/**
 * Removes patterns that have a Pattern Block that references the current pattern.
 * They cause an infinite loop.
 */
export default function filterOutPatterns(
	patterns: Patterns,
	patternSlug: Pattern[ 'slug' ]
) {
	return Object.entries( patterns ).reduce(
		( accumulator, [ key, pattern ] ) => {
			return {
				...accumulator,
				...( ! hasBlock(
					'core/pattern',
					parse( pattern.content ),
					patternSlug
				) && pattern.slug !== patternSlug
					? { [ key ]: pattern }
					: {} ),
			};
		},
		{}
	);
}
