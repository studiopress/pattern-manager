import { useState } from '@wordpress/element';
import { patternManager } from '../globals';
import getHeaders from '../utils/getHeaders';

export default function useEnvironment( initialEnvironmentNotice: boolean ) {
	const [ displayNotice, setDisplayNotice ] = useState(
		initialEnvironmentNotice
	);

	function updateDismissedSites() {
		setDisplayNotice( false );
		return fetch(
			patternManager.apiEndpoints.updateDismissedSitesEndpoint,
			{
				method: 'POST',
				headers: getHeaders(),
			}
		);
	}

	return {
		displayNotice,
		updateDismissedSites,
	};
}
