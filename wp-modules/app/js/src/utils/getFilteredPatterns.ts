/**
 * Internal dependencies
 */
import createPatternsWithUncategorized from './createPatternsWithUncategorized';
import type { Pattern, Patterns } from '../types';

export default function getFilteredPatterns(
	patterns: Patterns,
	searchTerm: string
) {
	return searchTerm.trim()
		? Object.entries( createPatternsWithUncategorized( patterns ) ).reduce(
				( acc, [ patternName, currentPattern ] ) => {
					// Add pattern header keys to the arr below to include in search.
					const match = [ 'title', 'keywords', 'description' ].some(
						( key: keyof Pattern ) => {
							return currentPattern[ key ]
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
								[ patternName ]: currentPattern,
						  }
						: acc;
				},
				{}
		  )
		: createPatternsWithUncategorized( patterns );
}
