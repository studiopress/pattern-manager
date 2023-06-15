/** Converts a string to a kebab-case. */
export default function toKebabCase( toConvert = '' ) {
	return toConvert.replace( /[\s_]+/g, '-' )
		.toLowerCase();
}
