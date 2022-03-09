/**
 * @param {string}                  theUrl
 * @param {Record<string, unknown>} params
 * @return {URL} THe full URL.
 */
export function assembleUrl( theUrl, params ) {
	const url = new URL( theUrl );
	Object.keys( params ).forEach( ( key ) =>
		url.searchParams.append( key, params[ key ] )
	);
	return url;
}
