import { useEffect } from '@wordpress/element';
import { select, subscribe, dispatch } from '@wordpress/data';

export default function useSaveButtonInterrupter() {
	function handleSave( event ) {
		event.preventDefault();
		window.parent.postMessage( 'pattern_manager_save_current_pattern' );
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
				window.parent.postMessage(
					'pattern_manager_save_current_pattern'
				);
			}
		} );
	}, [] );
}
