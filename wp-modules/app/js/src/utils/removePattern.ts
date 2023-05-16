import type { Pattern, Patterns } from '../types';

export default function removePattern(
	nameToDelete: Pattern[ 'slug' ],
	existingPatterns: Patterns
) {
	const {
		[ nameToDelete ]: {},
		...newPatterns
	} = existingPatterns;

	return newPatterns;
}
