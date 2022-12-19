import type { Pattern } from '../types'; // eslint-disable-line no-unused-vars
import convertToSlug from './convertToSlug';

function getDuplicateNumber( newSlug: string, allPatterns: Pattern[] ) {
	return allPatterns.reduce( ( highest, pattern ) => {
		if ( pattern.slug === newSlug ) {
			return 1 > highest ? 1 : highest;
		}

		const matches = pattern.slug.match( `^${ newSlug }-([0-9]+)$` );
		if ( ! matches ) {
			return highest;
		}

		const newDuplicateNumber = 1 + parseInt( matches[ 1 ] );
		return newDuplicateNumber > highest ? newDuplicateNumber : highest;
	}, 0 );
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
