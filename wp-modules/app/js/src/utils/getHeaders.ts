import { fsestudio } from '../globals';

export default function getHeaders() {
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-WP-Nonce': fsestudio.apiNonce,
	};
}
