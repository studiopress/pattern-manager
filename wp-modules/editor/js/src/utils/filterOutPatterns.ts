import { parse } from '@wordpress/blocks';
import hasPmPatternBlock from './hasPmPatternBlock';
import type { Pattern, Patterns } from '../types';

/**
 * Removes patterns that have a Pattern Block that references the current pattern.
 * They cause an infinite loop.
 */
export default function filterOutPatterns(
	patterns: Patterns,
	patternName: Pattern[ 'name' ]
) {
	return Object.entries( patterns ).reduce(
		( accumulator, [ key, pattern ] ) => {
			return {
				...accumulator,
				...( ! hasPmPatternBlock(
					parse( pattern.content ),
					patternName
				) && pattern.name !== patternName
					? { [ key ]: pattern }
					: {} ),
			};
		},
		{}
	);
}
