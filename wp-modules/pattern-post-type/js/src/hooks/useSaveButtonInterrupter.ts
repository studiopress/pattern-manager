import { store as editorStore } from '@wordpress/editor';
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect, select, subscribe } from '@wordpress/data';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';
import type { Pattern, SelectQuery } from '../types';
import { __ } from '@wordpress/i18n';

export default function useSaveButtonInterrupter(
	setPatternNames: ( patternNames: Array< Pattern[ 'name' ] > ) => void
) {
	const isSavingPost = select( 'core/editor' ).isSavingPost();
	const editor = useSelect( editorStore, [] );
	const { editPost, lockPostAutosaving } = useDispatch( 'core/editor' );
	const { createNotice } = useDispatch( 'core/notices' );

	useEffect( () => {
		if ( isSavingPost ) {
			handleSave();
		}
	}, [ isSavingPost ] );

	useEffect( () => {
		// Prevents the editor from changing the URL to post.php?post=<post ID>.
		lockPostAutosaving();

		Object.values(
			document.getElementsByClassName(
				'editor-post-publish-panel__toggle'
			)
		).forEach( ( saveButton ) => {
			saveButton.addEventListener( 'click', handleSave, false );
		} );

		// While the above event listeners handle interrupting save button clicks, this also handles keyboard shortcut saves (like cmd+s).
		subscribe( () => {
			if ( select( 'core/editor' ).isSavingPost() ) {
				handleSave( null );
			}
		} );
	}, [] );

	async function handleSave( event?: Event ) {
		event?.preventDefault();

		const meta = editor.getEditedPostAttribute( 'meta' );
		if ( ! meta.title ) {
			return;
		}

		Object.values(
			document.getElementsByClassName(
				'editor-post-publish-panel__toggle'
			)
		).forEach( ( saveButton ) => {
			saveButton.setAttribute( 'disabled', 'disabled' );
			saveButton.textContent = __( 'Saving pattern…', 'pattern-manager' );
		} );

		// If the pattern name changed, update the URL query param 'name'.
		// That query param gets the pattern data.
		if ( meta.previousName && meta.previousName !== meta.name ) {
			const url = new URL( document.location.href );
			url.searchParams.set( 'name', meta.name );
			window.history.pushState( {}, '', url );
		}

		await savePattern();
		await updatePatternNames();
		editPost( {
			meta: {
				...meta,
				previousName: meta.name,
			},
		} );
	}

	async function savePattern() {
		await fetch( patternManager.apiEndpoints.savePatternEndpoint, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify( {
				pattern: {
					...editor.getEditedPostAttribute( 'meta' ),
					content: editor.getEditedPostContent(),
				},
			} ),
		} )
			.then( async ( response ) => {
				// Put the save button back the way it was.
				Object.values(
					document.getElementsByClassName(
						'editor-post-publish-panel__toggle'
					)
				).forEach( ( saveButton ) => {
					saveButton.removeAttribute( 'disabled' );
					saveButton.textContent = __(
						'Save pattern to theme',
						'pattern-manager'
					);
				} );

				let data: { message: string } = {
					message: __( 'Something went wrong', 'pattern-manager' ),
				};

				try {
					data = await response.json();
				} catch ( error: any ) {
					throw error;
				}

				if ( ! response.ok ) {
					throw data;
				}

				createNotice( 'success', data.message, {
					type: 'snackbar',
					isDismissible: true,
				} );
			} )
			.catch( ( data: any ) => {
				createNotice(
					'error',
					data.message ? data?.message : JSON.stringify( data ),
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
			} );
	}

	async function updatePatternNames() {
		const response = await fetch(
			patternManager.apiEndpoints.getPatternNamesEndpoint,
			{
				method: 'GET',
				headers: getHeaders(),
			}
		);

		if ( response.ok ) {
			setPatternNames( await response.json() );
		}
	}
}
