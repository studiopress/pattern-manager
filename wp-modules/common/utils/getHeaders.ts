export default function getHeaders( nonce: string ) {
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-WP-Nonce': nonce,
	};
}
