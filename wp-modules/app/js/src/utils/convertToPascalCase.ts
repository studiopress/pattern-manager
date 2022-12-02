/* eslint-disable jsdoc/require-param-type, jsdoc/require-returns-type */

function capitalize( name: string ) {
	return name.charAt( 0 ).toUpperCase() + name.slice( 1 );
}

/**
 * Converts a string to a PascalCase.
 *
 * @param  toConvert The string to convert to a slug like 'example here'.
 * @return The string in PascalCase, like 'ExampleHere'.
 */
export default function convertToPascalCase( toConvert = '' ) {
	return toConvert
		.replace( /(^|[_\W]+)(\w)/g, ( fullMatch, firstMatch, secondMatch ) =>
			capitalize( secondMatch )
		)
		.replace( /\W/g, '' );
}
