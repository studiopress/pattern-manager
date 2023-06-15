/** Converts a string to a kebab-case. */
export default function toKebabCase( toConvert = '' ) {
	return toConvert
		.replace( /[_\W]+(?=\w+)/g, '-' )
		.toLowerCase();
}
