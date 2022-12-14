/** Assemble a URL given the base/relative URL and search parameters. */
export default function assembleUrl(
	theUrl: string,
	params: { [ key: string ]: string }
) {
	const url = new URL( theUrl );
	Object.keys( params ).forEach( ( key ) =>
		url.searchParams.append( key, params[ key ] )
	);
	return url;
}
