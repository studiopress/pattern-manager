import { patternmanager } from '../globals';
import getHeaders from './getHeaders';

export default async function switchThemeOnBackEnd(newThemeSlug: string) {
	await fetch(patternmanager.apiEndpoints.switchThemeEndpoint, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({
			dirname: newThemeSlug,
		}),
	});
}
