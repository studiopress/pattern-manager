/**
 * Converts a string to a PascalCase.
 *
 * @param {string?} toConvert The string to convert to a slug like 'example here'.
 * @return {string} The string in PascalCase, like 'ExampleHere'.
 */
export default function convertToPascalCase( toConvert = '' ) {
	return toConvert.replace(
		/(?<=^|[_\W])[a-z]/g,
		( match ) => match.toUpperCase()
	);
}
