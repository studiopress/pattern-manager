import { useEffect } from '@wordpress/element';
import { select, subscribe } from '@wordpress/data';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';
import type { PostMeta } from '../types';
import type usePatternData from './usePatternData';

export default function useSaveButtonInterrupter(
	content: PostMeta[ 'content' ],
	meta: PostMeta,
	updatePostMeta: ReturnType< typeof usePatternData >[ 'updatePostMeta' ]
) {
	function savePattern() {
		fetch( patternManager.apiEndpoints.savePatternEndpoint, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify( {
				pattern: {
					...meta,
					content,
				},
			} ),
		} );
	}

	function handleSave( event: Event ) {
		const previousName = meta.name;
		event.preventDefault();
		savePattern();
		updatePostMeta( 'previousName', previousName );
	}

	useEffect( () => {
		const saveButtons = document.getElementsByClassName(
			'editor-post-publish-panel__toggle'
		);

		for ( let i = 0; i < saveButtons.length; i++ ) {
			saveButtons[ i ].addEventListener( 'click', handleSave, false );
		}
	}, [] );
}
