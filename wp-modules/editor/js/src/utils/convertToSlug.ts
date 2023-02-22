/** Converts a string to a slug. */
export default function convertToSlug( toConvert = '' ) {
	return toConvert
		.replace( /[_\W]+(?=\w+)/g, '-' )
		.replace( /[^-\w]/g, '' )
		.toLowerCase();
}
