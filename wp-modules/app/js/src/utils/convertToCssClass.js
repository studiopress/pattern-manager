/**
 * Converts a string to a css class.
 *
 * @param {string?} toConvert The string to convert to a css class like 'ExampleHere'.
 * @return {string} The string as a slug, like 'example-here'.
 */
export default function convertToCssClass( toConvert = '' ) {
	const matches = toConvert.match( /([A-Z]|\d{1,}|\.)/g );

	if ( ! matches ) {
		return toConvert;
	}

	Array.from( new Set(matches) ).forEach( ( match ) => {
		toConvert = toConvert.replace( match, '-' + match );
	} );

	return toConvert.replace( /(^\-|\.)/g, '' ).toLowerCase();
}
