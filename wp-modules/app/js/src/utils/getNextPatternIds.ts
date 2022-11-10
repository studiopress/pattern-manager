/* eslint-disable no-undef */

import convertToPascalCase from './convertToPascalCase';
import convertToSlug from './convertToSlug';
import convertToUpperCase from './convertToUpperCase';

import { Pattern } from '../types';

type Patterns = {
	[ key: string ]: Pattern;
};

// The number, title, and slug for the new pattern.
type NextPattern = {
	patternNumber: number;
	patternTitle: string;
	patternSlug: string;
};

// Get the new title and slug when creating a new pattern.
export default function getNextPatternIds(
	object: Patterns,
	field: 'slug' | 'title' | 'name',
	base: string = 'my-new-pattern'
): NextPattern {
	const regex = new RegExp( `^${ stripSpecialChars( base ) }([0-9]+)$` );

	const patternNumber = Object.values( object ).reduce( ( acc, pattern ) => {
		const value: string = pattern[ field ] || '';
		if ( value === base && ! acc ) {
			return 1;
		}

		// Parse last array element for number to increment.
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
		patternNumber,
		patternTitle,
		patternSlug,
	};
}

const stripSpecialChars = ( str: string ) => str.replace( /[^A-Za-z0-9]/g, '' );
const splitSpecialChars = ( str: string ) => str.split( /[.\-=/_ ]/ );
