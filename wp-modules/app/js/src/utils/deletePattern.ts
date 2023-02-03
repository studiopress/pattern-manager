import type { Pattern, Patterns } from '../types';

export default function deletePattern(
	nameToDelete: Pattern[ 'name' ],
	existingPatterns: Patterns
) {
	const {
		[ nameToDelete ]: {},
		...newPatterns
	} = existingPatterns;

	return newPatterns;
}
