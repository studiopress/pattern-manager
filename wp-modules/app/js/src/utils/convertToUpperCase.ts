/* eslint-disable jsdoc/require-param-type, jsdoc/require-returns-type */

function capitalize( name: string ) {
	return name.charAt( 0 ).toUpperCase() + name.slice( 1 );
}

/**
 * Converts a string to a Upper Case.
 *
 * @param  toConvert The string to convert, like 'exampleHere'.
 * @return The string in Upper Case, like 'Example Here'.
 */
export default function convertToUpperCase( toConvert = '' ) {
	return capitalize(
		toConvert.replace(
			/([a-z])([A-Z1-9])/g,
			( match ) => `${ match[ 0 ] } ${ match[ 1 ] }`
		)
	);
}
