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
 * The field can be used along with pretty much any base to be split by special character.
 * The last element in the array is then parsed to find the number to increment.
 *
 * @param {Patterns} object
 * @param {string}   field
 * @param {string}   base
 * @return {Object} The title and slug for new pattern.
 */
export default function getNextPatternIds(
	object,
	field = 'slug',
	base = 'my-new-pattern'
) {
	const regex = new RegExp( `^${ stripSpecialChars( base ) }([0-9]+)$` );

	const patternNumber = Object.values( object ).reduce( ( acc, pattern ) => {
		const value = pattern[ field ] || '';
		if ( value === base && ! acc ) {
			return 1;
		}

		const lastNum = splitSpecialChars( value ).pop();
		return stripSpecialChars( value ).match( regex ) &&
			parseInt( lastNum ) + 1 >= acc
			? parseInt( lastNum ) + 1
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

const stripSpecialChars = ( str ) => str.replace( /[^A-Za-z0-9]/g, '' );
const splitSpecialChars = ( str ) => str.split( /[.\-=/_ ]/ );
