export default function stripIllegalChars( toConvert: string ) {
	return toConvert.replace( /[^\s\w_-]/g, '' );
}
