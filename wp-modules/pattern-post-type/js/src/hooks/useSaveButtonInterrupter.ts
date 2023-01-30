import { useEffect } from '@wordpress/element';
import { select, subscribe } from '@wordpress/data';
import { Patterns } from '../types';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';

export default function useSaveButtonInterrupter( patterns: Patterns, updatePatterns: ( newPatterns: Patterns ) => void ) {
	function savePatterns() {
		fetch( patternManager.apiEndpoints.savePatternsEndpoint, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify( { patterns } ),
		} )
			.then( ( response ) => {
				if ( ! response.ok ) {
					throw response.statusText;
				}
				return response.json();
			} )
			.then( ( data: { patterns: Patterns } ) => {
				updatePatterns( data.patterns );
			} );
	}

	function handleSave( event ) {
		event.preventDefault();
		savePatterns();
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
				savePatterns();
			}
		} );
	}, [] );
}
