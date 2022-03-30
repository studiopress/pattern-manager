/**
 * @param {string}                 theUrl
 * @param {Record<string, string>} params
 * @return {URL} THe full URL.
 */
export default function assembleUrl(theUrl, params) {
	const url = new URL(theUrl);
	Object.keys(params).forEach((key) =>
		url.searchParams.append(key, params[key])
	);
	return url;
}
