import { useState } from '@wordpress/element';
import { patternManager } from '../globals';
import getHeaders from '../utils/getHeaders';
import type { Theme } from '../types';

export default function useVersionControl(
	initialVersionControlNotice: boolean
) {
	const [ displayNotice, setDisplayNotice ] = useState(
		initialVersionControlNotice
	);

	function updateDismissedThemes() {
		setDisplayNotice( false );
		return fetch(
			patternManager.apiEndpoints.updateDismissedThemesEndpoint,
			{
				method: 'POST',
				headers: getHeaders(),
			}
		);
	}

	return {
		displayNotice,
		updateDismissedThemes,
	};
}
