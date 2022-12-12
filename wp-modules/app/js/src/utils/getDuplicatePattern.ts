import type { Pattern } from '../types'; // eslint-disable-line no-unused-vars
import convertToSlug from './convertToSlug';

function getDuplicateNumber( newSlug: string, allPatterns: Pattern[] ) {
	const slugs = allPatterns.map( ( pattern ) => {
		return pattern.slug;
	} );

	if ( ! slugs.includes( newSlug ) ) {
		return 0;
	}

	for ( let i = 1; i <= slugs.length; i++ ) {
		if ( ! slugs.includes( `${ newSlug }-${ i }` ) ) {
			return i;
		}
	}
}

export default function getDuplicatePattern(
	patternToDuplicate: Pattern,
	allPatterns: Pattern[]
) {
	const newTitle = `${ patternToDuplicate.title } (copied)`;
	const duplicateNumber = getDuplicateNumber(
		convertToSlug( newTitle ),
		allPatterns
	);
	const newTitleWithDuplicateNumber = duplicateNumber
		? `${ newTitle } ${ duplicateNumber }`
		: newTitle;

	return {
		...patternToDuplicate,
		title: newTitleWithDuplicateNumber,
		slug: convertToSlug( newTitleWithDuplicateNumber ),
		name: convertToSlug( newTitleWithDuplicateNumber ),
	};
}
