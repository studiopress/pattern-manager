import { fsestudio } from '../globals';
import getHeaders from './getHeaders';

/** @param {string} newThemeSlug */
export default async function switchThemeOnBackEnd( newThemeSlug ) {
	await fetch( fsestudio.apiEndpoints.switchThemeEndpoint, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify( {
			dirname: newThemeSlug,
		} ),
	} );
}
