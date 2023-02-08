import { store as editorStore } from '@wordpress/editor';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import getHeaders from '../utils/getHeaders';
import { patternManager } from '../globals';
import type { Pattern } from '../types';
import { __ } from '@wordpress/i18n';

export default function useSaveButtonInterrupter(
	setPatternNames: ( patternNames: Array< Pattern[ 'name' ] > ) => void
) {
	const [ isSavingPattern, setIsSavingPattern ] = useState( false );
	const editor = useSelect( editorStore, [] );
	const { editPost, lockPostAutosaving } = useDispatch( 'core/editor' );
	const { createNotice } = useDispatch( 'core/notices' );

	useEffect( () => {
		// Prevents the editor from changing the URL to post.php?post=<post ID>.
		lockPostAutosaving();

		// Listen for clicks on the save button.
		Object.values(
			document.getElementsByClassName(
				'editor-post-publish-panel__toggle'
			)
		).forEach( ( saveButton ) => {
			saveButton.addEventListener( 'click', handleSave, false );
		} );

		// Listen for keyboard cmd+s events as well.

		document.addEventListener( 'keydown', function ( event ) {
			if ( ( event.ctrlKey || event.metaKey ) && event.key === 's' ) {
				handleSave( event );
			}
		} );
	}, [] );

	async function handleSave( event?: Event ) {
		event?.preventDefault();

		//If we are already waiting for a save to finish, don't do anything here.
		if ( isSavingPattern ) {
			return;
		}
		setIsSavingPattern( true );

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
				setIsSavingPattern( false );

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
