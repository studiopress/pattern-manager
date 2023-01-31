import { useEffect } from '@wordpress/element';
import { select, subscribe } from '@wordpress/data';
import { Pattern, PostMeta } from '../types';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';

export default function useSaveButtonInterrupter( postMeta: PostMeta ) {
	function savePattern() {
		fetch( patternManager.apiEndpoints.savePatternEndpoint, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify( {
				pattern: postMeta,
			} ),
		} );
	}

	function handleSave( event ) {
		event.preventDefault();
		savePattern();
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
