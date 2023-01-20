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
	return getPatternsBySearchTerm(
		getPatternsByCategory(
			createPatternsWithUncategorized( patterns ),
			categoryName
		),
		searchTerm.trim()
	);
}

function getPatternsBySearchTerm( patterns: Patterns, searchTerm: string ) {
	return searchTerm.trim()
		? Object.entries( patterns ).reduce(
				( acc, [ patternName, pattern ] ) => {
					// Add pattern header keys to the arr below to include in search.
					const match = [ 'title', 'keywords', 'description' ].some(
						( key: keyof Pattern ) => {
							return pattern[ key ]
								?.toString()
								.toLowerCase()
								.includes(
									searchTerm.toString().toLowerCase()
								);
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
		  )
		: patterns;
}

function getPatternsByCategory( patterns: Patterns, categoryName: string ) {
	const categoryToAlwaysInclude = 'all-patterns';

	return categoryName
		? Object.entries( patterns ).reduce(
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
		: patterns;
}
