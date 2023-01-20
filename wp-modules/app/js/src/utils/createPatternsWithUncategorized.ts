import { Patterns } from '../types';

/** Create a Patterns object that includes an 'uncategorized' category. */
export default function createPatternsWithUncategorized(
	ownPatterns: Patterns
): Patterns {
	return Object.entries( ownPatterns ).reduce(
		( acc, [ patternId, { categories } ] ) => ( {
			...acc,
			[ patternId ]: {
				...ownPatterns[ patternId ],
				categories: [
					// Spread in the categories, or 'uncategorized' if empty.
					...( categories?.length
						? categories
						: [ 'uncategorized' ] ),
				],
			},
		} ),
		{}
	);
}
