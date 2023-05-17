/** Converts a string to kebab-case. */
export default function toKebabCase( toConvert = '' ) {
	return toConvert
		.replace( /[_\W]+(?=\w+)/g, '-' )
		.replace( /[^-\w]/g, '' )
		.toLowerCase();
}
