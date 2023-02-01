import { useEffect } from '@wordpress/element';
import { select, subscribe } from '@wordpress/data';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';
import type { PostMeta } from '../types';
import type usePatternData from './usePatternData';

export default function useSaveButtonInterrupter(
	postMeta: PostMeta,
	updatePostMeta: ReturnType< typeof usePatternData >[ 'updatePostMeta' ]
) {
	function savePattern() {
		fetch( patternManager.apiEndpoints.savePatternEndpoint, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify( {
				pattern: {
					...select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
					content: select( 'core/editor' ).getEditedPostContent(),
				},
			} ),
		} );
	}

	function handleSave( event: Event ) {
		event.preventDefault();
		savePattern();
		updatePostMeta( 'previousName', postMeta.name );
	}

	useEffect( () => {
		const saveButtons = document.getElementsByClassName(
			'editor-post-publish-panel__toggle'
		);

		for ( let i = 0; i < saveButtons.length; i++ ) {
			saveButtons[ i ].addEventListener( 'click', handleSave, false );
		}

		// While the above event listeners handle interrupting save button clicks, this also handles keyboard shortcut saves (like cmd+s).
		subscribe( () => {
			if ( select( 'core/editor' ).isSavingPost() ) {
				savePattern();
			}
		} );
	}, [] );
}
