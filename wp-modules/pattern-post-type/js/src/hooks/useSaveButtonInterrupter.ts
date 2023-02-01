import { useEffect } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';

export default function useSaveButtonInterrupter() {
	const { editPost } = useDispatch( 'core/editor' );

	function savePattern () {
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
