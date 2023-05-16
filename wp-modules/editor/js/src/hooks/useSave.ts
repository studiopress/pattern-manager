import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';
import type { Pattern, SelectQuery } from '../types';

export default function useSave(
	setPatternNames: ( patternNames: Array< Pattern[ 'slug' ] > ) => void
) {
	const isSavingPost = useSelect( ( select: SelectQuery ) => {
		return select( 'core/editor' ).isSavingPost();
	}, [] );

	useEffect( () => {
		if ( isSavingPost ) {
			updatePatternNames();
		}
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
