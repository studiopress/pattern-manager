import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';
import type { Pattern, SelectQuery } from '../types';

export default function useSave(
	setPatternNames: ( patternNames: Array< Pattern[ 'name' ] > ) => void
) {
	const isSavingPost = useSelect( ( select: SelectQuery ) => {
		return select( 'core/editor' ).isSavingPost();
	}, [] );

	useEffect( () => {
		if ( isSavingPost ) {
			updatePatternNames();
		}
		// We can ignore this because updatePatternNames is always created fresh on every render.
		// NOTE: make sure that other dependencies required are added in the future, as the linter could miss them here.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isSavingPost ] );

	async function updatePatternNames() {
		const response = await fetch(
			patternManager.apiEndpoints.getPatternNamesEndpoint,
			{
				method: 'GET',
				headers: getHeaders(),
			}
		);

		if ( response.ok ) {
			const data = await response.json();
			setPatternNames( data.patternNames );
		}
	}
}
