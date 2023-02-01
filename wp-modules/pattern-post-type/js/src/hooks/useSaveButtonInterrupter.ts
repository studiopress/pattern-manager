import { store as editorStore } from '@wordpress/editor';
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';
import type { SelectQuery } from '../types';

export default function useSaveButtonInterrupter() {
	const isSavingPost = useSelect( ( select: SelectQuery ) => {
		return select( 'core/editor' ).isSavingPost();
	}, [] );
	const editor = useSelect( editorStore, [] );
	const { editPost } = useDispatch( 'core/editor' );

	useEffect( () => {
		Object.values(
			document.getElementsByClassName(
				'editor-post-publish-panel__toggle'
			)
		).forEach( ( saveButton ) => {
			saveButton.addEventListener( 'click', handleSave, false );
		} );
	}, [] );

	useEffect( () => {
		if ( isSavingPost ) {
			handleSave();
		}
	}, [ isSavingPost ] );

	function handleSave( event?: Event ) {
		event?.preventDefault();

		const meta = editor.getEditedPostAttribute( 'meta' );
		const previousName = meta?.name;

		savePattern();
		editPost( {
			meta: {
				...meta,
				previousName,
			},
		} );
	}

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
}
