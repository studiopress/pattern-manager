import type { Pattern, Patterns } from '../types';

export default function removePattern(
	nameToDelete: Pattern[ 'filename' ],
	existingPatterns: Patterns
) {
	const {
		[ nameToDelete ]: {},
		...newPatterns
	} = existingPatterns;

	return newPatterns;
}
