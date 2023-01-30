import { patternManager } from '../../../../app/js/src/globals';

export default function getHeaders() {
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-WP-Nonce': patternManager.apiNonce,
	};
}
