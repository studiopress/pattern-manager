import { useState } from '@wordpress/element';
import { patternManager } from '../globals';
import getHeaders from '../utils/getHeaders';
import type { Theme } from '../types';

export default function useVersionControl(
	initialDismissedThemes: Array< Theme[ 'name' ] >
) {
	const [ dismissedThemes, setDismissedThemes ] = useState<
		Array< Theme[ 'name' ] >
	>( initialDismissedThemes );

	const warningShouldShow =
		! Boolean( patternManager.versionControl ) &&
		! dismissedThemes.some(
			( dismissedTheme ) => dismissedTheme === patternManager.themeName
		);

	function updateDismissedThemes( themeNameToDismiss: Theme[ 'name' ] ) {
		return fetch(
			patternManager.apiEndpoints.updateDismissedThemesEndpoint,
			{
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify( {
					themeNames: dismissedThemes.reduce(
						( acc, themeName ) => {
							return ! acc.includes( themeName )
								? [ ...acc, themeName ]
								: acc;
						},
						[ themeNameToDismiss ]
					),
				} ),
			}
		)
			.then( ( response ) => response.json() )
			.then(
				( data: {
					message: string;
					dismissedThemes: Array< Theme[ 'name' ] >;
				} ) => {
					setDismissedThemes( data.dismissedThemes );
				}
			);
	}

	return {
		warningShouldShow,
		updateDismissedThemes,
	};
}
