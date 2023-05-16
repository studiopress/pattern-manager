import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';
import type { Pattern, SelectQuery } from '../types';

export default function useSave(
	setPatternFileNames: ( patternFileNames: Array< Pattern[ 'filename' ] > ) => void
) {
	const isSavingPost = useSelect( ( select: SelectQuery ) => {
		return select( 'core/editor' ).isSavingPost();
	}, [] );

	useEffect( () => {
		if ( isSavingPost ) {
			updatePatternFileNames();
		}
	}, [ isSavingPost ] );

	async function updatePatternFileNames() {
		const response = await fetch(
			patternManager.apiEndpoints.getPatternFileNamesEndpoint,
			{
				method: 'GET',
				headers: getHeaders(),
			}
		);

		if ( response.ok ) {
			const data = await response.json();
			setPatternFileNames( data.patternFileNames );
		}
	}
}
