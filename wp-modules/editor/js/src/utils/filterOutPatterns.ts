import { Pattern, Patterns } from '../types';
import { parse } from '@wordpress/blocks';
import hasPmPatternBlock from './hasPmPatternBlock';

/** Removes patterns that have a PM Pattern Block, as they can cause an infinite loop. */
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
