import '../../css/src/index.scss';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

// Change the word "Publish" to "Save Pattern"
function changeWords( translation, text ) {
	const postMeta = wp.data
	.select( 'core/editor' )
	.getEditedPostAttribute( 'meta' );

	if ( postMeta?.type === 'pattern' ) {
		if ( text === 'Publish' ) {
			return 'Save pattern to theme';
		}
		if ( text === 'Post published.' || text === 'Post updated.' ) {
			return 'Pattern saved to theme';
		}
		if ( text === 'Update' || text === 'Post updated.' ) {
			return 'Update Pattern';
		}
		if ( text === 'Add New Tag' ) {
			return 'Pattern Categories';
		}
		if ( text === 'Saved' ) {
			return 'Saved to your theme directory';
		}
	}

	if ( postMeta?.type === 'template' ) {
		if ( text === 'Pattern' ) {
			return 'Template';
		}
		if ( text === 'Publish' ) {
			return 'Save template to theme';
		}
		if ( text === 'Post published.' || text === 'Post updated.' ) {
			return 'Template saved to theme';
		}
		if ( text === 'Update' || text === 'Post updated.' ) {
			return 'Update Template';
		}
		if ( text === 'Add New Tag' ) {
			return 'Pattern Categories';
		}
		if ( text === 'Saved' ) {
			return 'Saved to your theme directory';
		}
	}

	return translation;
}
wp.hooks.addFilter(
	'i18n.gettext',
	'fse-studio/changeWords',
	changeWords
);

wp.hooks.removeFilter(
	'blockEditor.__unstableCanInsertBlockType',
	'removeTemplatePartsFromInserter',
);

// Tell the parent page (fse studio) that we are loaded.
let fsestudioPatternEditorLoaded = false;
let fsestudioPatternIsSaved = true;

wp.data.subscribe( () => {
	// Force the sidebar navigation to remain closed.
	if ( wp.data.select( 'core/edit-site' ).isNavigationOpened() ) {
		wp.data.dispatch( 'core/edit-site' ).setIsNavigationPanelOpened( false );
	}
} );

let fsestudioSaveAndRefreshDebounce = null;
// If the FSE Studio app sends an instruction, listen for and do it here.
window.addEventListener(
	'message',
	( event ) => {
		try {
			const response = JSON.parse( event.data );
			
			if ( response.message === 'fsestudio_save_and_refresh' ) {
				// If the FSE Studio apps tells us to save the current post, do it:
				clearTimeout( fsestudioSaveAndRefreshDebounce );
				fsestudioSaveAndRefreshDebounce = setTimeout( () => {
					wp.data
						.dispatch( 'core/editor' )
						.savePost()
						.then( () => {
							window.location.reload();
						} );
				}, 200 );
			}
			
			if ( response.message === 'fsestudio_save' ) {
				// If the FSE Studio apps tells us to save the current post, do it:
				clearTimeout( fsestudioSaveAndRefreshDebounce );
				fsestudioSaveAndRefreshDebounce = setTimeout( () => {
					console.log( 'lets try a save' );
					// Trigger a click event on the "Save" button in the site editor.
					const element = document.getElementsByClassName("edit-site-save-button__button");
					
					if ( element.item(0) ) {
						element.item(0).click();
					}
					
					setTimeout(() => {
						const saveEntitiesElement = document.getElementsByClassName("editor-entities-saved-states__save-button");
						if ( saveEntitiesElement.item(0) ) {
							saveEntitiesElement.item(0).click();
						}
					}, 100 );
					
				}, 200 );
			}

		} catch ( e ) {
			// Message posted was not JSON, so do nothing.
		}
	},
	false
);

document.addEventListener('keydown', (e) => {

	if(e.metaKey && e.key === 's'){
	    console.log('CTRL/META + s');
	}
	
 });