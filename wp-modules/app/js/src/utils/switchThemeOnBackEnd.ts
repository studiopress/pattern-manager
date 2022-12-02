import { fsestudio } from '../globals';
import getHeaders from './getHeaders';

export default async function switchThemeOnBackEnd( newThemeSlug: string ) {
	await fetch( fsestudio.apiEndpoints.switchThemeEndpoint, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify( {
			dirname: newThemeSlug,
		} ),
	} );
}
