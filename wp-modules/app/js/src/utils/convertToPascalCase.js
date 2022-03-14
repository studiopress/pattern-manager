function capitalize( name ) {
	return name.charAt( 0 ).toUpperCase() + name.slice( 1 );
}

/**
 * Converts a string to a PascalCase.
 *
 * @param {string?} toConvert The string to convert to a slug like 'Example Here'.
 * @return {string} The string in PascalCase, like 'ExampleHere'.
 */
 export default function convertToPascalCase( toConvert = '' ) {
	return toConvert
		.replace( 
			/(^|_|[^\w])([\w]*)/g,
			( fullMatch, firstMatch, secondMatch ) => capitalize( secondMatch )
		)
}
