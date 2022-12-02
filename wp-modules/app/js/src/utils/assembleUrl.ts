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
