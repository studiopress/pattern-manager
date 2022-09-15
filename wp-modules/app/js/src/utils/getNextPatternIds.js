// @ts-check
/* eslint-disable jsdoc/valid-types */

import convertToPascalCase from './convertToPascalCase';
import convertToSlug from './convertToSlug';
import convertToUpperCase from './convertToUpperCase';

/**
 * @typedef {{
 *  [key: string]: import('../components/PatternPicker').Pattern
 * }} Patterns
 */

/**
 * Get the new title and slug when creating a new pattern.
 *
 * @param {Patterns} object
 * @param {string}   base
 * @return {Object} The title and slug for new pattern.
 */
export default function getNextPatternIds(
	object,
	base = 'my-new-pattern' // Expected to be a hyphenated slug.
) {
	const field = 'slug';
	const regex = new RegExp( `^${ base }-([0-9]+)$` );

	const patternNumber = Object.values( object ).reduce( ( acc, pattern ) => {
		const value = pattern[ field ];
		if ( value === base && ! acc ) {
			return 1;
		}

		return value.match( regex ) &&
			parseInt( value.match( regex ).filter( Boolean )[ 1 ] ) + 1 >= acc
			? parseInt( value.match( regex ).filter( Boolean )[ 1 ] ) + 1
			: acc;
	}, 0 );

	const convertedBase = convertToUpperCase( convertToPascalCase( base ) );
	const patternTitle = patternNumber
		? `${ convertedBase } ${ patternNumber }`
		: convertedBase;

	const patternSlug = convertToSlug( patternTitle );

	return {
		patternTitle,
		patternSlug,
	};
}
