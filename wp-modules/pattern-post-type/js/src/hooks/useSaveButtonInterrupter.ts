import { store as editorStore } from '@wordpress/editor';
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';

export default function useSaveButtonInterrupter() {
	const { editPost } = useDispatch( 'core/editor' );
	const editor = useSelect( editorStore, [] );

	function savePattern() {
		fetch( patternManager.apiEndpoints.savePatternEndpoint, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify( {
				pattern: {
					...editor.getEditedPostAttribute( 'meta' ),
					content: editor.getEditedPostContent(),
				},
			} ),
		} );
	}

	function handleSave( event: Event ) {
		event.preventDefault();

		const meta = editor.getEditedPostAttribute( 'meta' )?.name;
		const previousName = meta?.name;

		savePattern();
		editPost( { 
			meta: {
				...meta,
				previousName,
			},
		} );
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
