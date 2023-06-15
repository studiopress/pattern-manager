export default function stripIllegalChars( toConvert: string ) {
	return toConvert.replace( /[^-\w]/g, '' );
}
