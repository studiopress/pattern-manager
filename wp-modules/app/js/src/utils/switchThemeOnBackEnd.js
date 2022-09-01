import { fsestudio } from '../globals';
import getHeaders from './getHeaders';

/** @param {string} newThemeSlug */
export default function switchThemeOnBackEnd( newThemeSlug ) {
	fetch( fsestudio.apiEndpoints.switchThemeEndpoint, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify( {
			dirname: newThemeSlug,
		} ),
	} );
}
