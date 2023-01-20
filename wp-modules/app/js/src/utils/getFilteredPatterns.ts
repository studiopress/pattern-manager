/**
 * Internal dependencies
 */
import createPatternsWithUncategorized from './createPatternsWithUncategorized';
import type { Pattern, Patterns } from '../types';

export default function getFilteredPatterns(
	patterns: Patterns,
	searchTerm: string,
	categoryName: string
) {
	const categoryToAlwaysInclude = 'all-patterns';
	const filteredByCategory = categoryName
		? Object.entries( createPatternsWithUncategorized( patterns ) ).reduce(
				( accumulator, [ patternName, pattern ] ) => {
					return pattern.categories?.includes( categoryName ) ||
						categoryName === categoryToAlwaysInclude
						? {
								...accumulator,
								[ patternName ]: pattern,
						  }
						: accumulator;
				},
				{}
		  )
		: createPatternsWithUncategorized( patterns );

	return searchTerm.trim()
		? getPatternsBySearchTerm( patterns, searchTerm )
		: filteredByCategory;
}

function getPatternsBySearchTerm( patterns, searchTerm ) {
	return Object.entries( patterns ).reduce(
		( acc, [ patternName, pattern ] ) => {
			// Add pattern header keys to the arr below to include in search.
			const match = [ 'title', 'keywords', 'description' ].some(
				( key: keyof Pattern ) => {
					return pattern[ key ]
						?.toString()
						.toLowerCase()
						.includes( searchTerm.toString().toLowerCase() );
				}
			);

			return match
				? {
						...acc,
						[ patternName ]: pattern,
				  }
				: acc;
		},
		{}
	);
}
