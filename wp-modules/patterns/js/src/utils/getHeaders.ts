import { patternManager } from '../globals';

export default function getHeaders() {
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-WP-Nonce': patternManager.apiNonce,
	};
}
