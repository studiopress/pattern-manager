function capitalize( name: string ) {
	return name.charAt( 0 ).toUpperCase() + name.slice( 1 );
}

/** Converts a string to a PascalCase. */
export default function convertToPascalCase( toConvert = '' ) {
	return toConvert
		.replace( /(^|[_\W]+)(\w)/g, ( fullMatch, firstMatch, secondMatch ) =>
			capitalize( secondMatch )
		)
		.replace( /\W/g, '' );
}
