/** @param {string} name */
function capitalize(name) {
	return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Converts a string to a PascalCase.
 *
 * @param {string?} toConvert The string to convert to a slug like 'example here'.
 * @return {string} The string in PascalCase, like 'ExampleHere'.
 */
export default function convertToPascalCase(toConvert = '') {
	return toConvert
		.replace(/(^|[_\W]+)(\w)/g, (fullMatch, firstMatch, secondMatch) =>
			capitalize(secondMatch)
		)
		.replace(/[^\w]/g, '');
}
