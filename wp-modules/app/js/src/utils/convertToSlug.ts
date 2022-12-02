/* eslint-disable jsdoc/require-param-type, jsdoc/require-returns-type */

/**
 * Converts a string to a slug.
 *
 * @param  toConvert The string to convert to a slug like 'Example Here'.
 * @return The string as a slug, like 'example-here'.
 */
export default function convertToSlug( toConvert = '' ) {
	return toConvert
		.replace( /[_\W]+(?=\w+)/g, '-' )
		.replace( /[^-\w]/g, '' )
		.toLowerCase();
}
