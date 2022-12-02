/* eslint-disable jsdoc/require-param-type, jsdoc/require-returns-type */

/**
 * Assemble a URL given the base/relative URL and search parameters.
 *
 * @param  theUrl
 * @param  params
 * @return The full URL.
 */
export default function assembleUrl(
	theUrl: string,
	params: Record< string, string >
) {
	const url = new URL( theUrl );
	Object.keys( params ).forEach( ( key ) =>
		url.searchParams.append( key, params[ key ] )
	);
	return url;
}
