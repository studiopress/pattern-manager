const defaultPattern = new RegExp( /([^a-z0-9 -]+)/gi );

export function checkIllegalChars(
	input: string,
	regexPattern = defaultPattern
) {
	return input.match( regexPattern );
}

export function stripIllegalChars(
	input: string,
	regexPattern = defaultPattern
) {
	return input.replace( regexPattern, '' );
}
