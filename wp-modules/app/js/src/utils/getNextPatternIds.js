// @ts-check
import convertToPascalCase from './convertToPascalCase';
import convertToSlug from './convertToSlug';
import convertToUpperCase from './convertToUpperCase';

/**
 * @typedef {{
 *  object: ReturnType<import('../hooks/useStudioContext').currentTheme.data.included_patterns>
 * }} Patterns
 */

/**
 * Get the next number for creating a new pattern slug.
 *
 * Finds the high number from existing slugs in `included_patterns` by matching against regex.
 * Then the result plus 1 (or null) is returned.
 *
 * @param {Patterns} object
 * @param {string}   field
 * @param {string}   base
 * @return {Object} The high number match plus 1, or null.
 */
export default function getNextPatternIds(
	object,
	field = 'slug',
	base = 'my-new-pattern'
) {
	const regex = new RegExp( `^${ base }-([0-9]+)$` );
	const convertedBase = convertToUpperCase( convertToPascalCase( base ) );

	const patternNumber = Object.values( object ).reduce( ( acc, pattern ) => {
		const value = pattern[ field ];
		if ( value === base && ! acc ) {
			return 1;
		}

		return value.match( regex ) &&
			parseInt( value.match( regex )[ 1 ] ) + 1 > acc
			? parseInt( value.match( regex )[ 1 ] ) + 1
			: acc;
	}, null );

	const patternTitle = patternNumber
		? `${ convertedBase } ${ patternNumber }`
		: convertedBase;

	const patternSlug = convertToSlug( patternTitle );

	return {
		patternTitle,
		patternSlug,
	};
}
