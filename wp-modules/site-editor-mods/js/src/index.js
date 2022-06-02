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
wp.hooks.addFilter( 'i18n.gettext', 'fse-studio/changeWords', changeWords );

wp.hooks.removeFilter(
	'blockEditor.__unstableCanInsertBlockType',
	'removeTemplatePartsFromInserter'
);

let fsestudioSiteEditorIsUnsaved = false;
wp.data.subscribe( () => {
	// Force the sidebar navigation to remain closed.
	if ( wp.data.select( 'core/edit-site' ).isNavigationOpened() ) {
		wp.data
			.dispatch( 'core/edit-site' )
			.setIsNavigationPanelOpened( false );
	}

	// If the editor is dirty and needs saving, set a flag.
	if (
		wp.data.select( 'core' ).__experimentalGetDirtyEntityRecords().length >
		0
	) {
		window.parent.postMessage( 'fsestudio_site_editor_dirty' );
		fsestudioSiteEditorIsUnsaved = true;
	}

	// If saving was just completed, trigger message to fsestudio app.
	if (
		wp.data.select( 'core' ).__experimentalGetDirtyEntityRecords()
			.length === 0 &&
		fsestudioSiteEditorIsUnsaved
	) {
		// If a successful save was just completed, send a message to the fsestudio app in the parent iframe.
		fsestudioSiteEditorIsUnsaved = false;
		window.parent.postMessage( 'fsestudio_site_editor_save_complete' );
	}
} );

let fsestudioSaveDebounce = null;
let fsestudioSaveAndRefreshDebounce = null;
let fsestudioThemeJsonChangeDebounce = null;
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
					// Trigger a click event on the "Save" button in the site editor.
					const element = document.getElementsByClassName(
						'edit-site-save-button__button'
					);

					if ( element.item( 0 ) ) {
						element.item( 0 ).click();
					}

					setTimeout( () => {
						const saveEntitiesElement = document.getElementsByClassName(
							'editor-entities-saved-states__save-button'
						);
						if ( saveEntitiesElement.item( 0 ) ) {
							saveEntitiesElement.item( 0 ).click();
						}

						// Then refresh the page.
						setTimeout( () => {
							window.location.reload();
						}, 100 );
					}, 100 );
				}, 200 );
			}

			if ( response.message === 'fsestudio_save' ) {
				// If the FSE Studio apps tells us to save the current post, do it:
				clearTimeout( fsestudioSaveDebounce );
				fsestudioSaveDebounce = setTimeout( () => {
					// Trigger a click event on the "Save" button in the site editor.
					const element = document.getElementsByClassName(
						'edit-site-save-button__button'
					);

					if ( element.item( 0 ) ) {
						element.item( 0 ).click();
					}

					// Once the panel has been opened, click on the save button in the "are you sure" pop out panel.
					setTimeout( () => {
						const saveEntitiesElement = document.getElementsByClassName(
							'editor-entities-saved-states__save-button'
						);
						if ( saveEntitiesElement.item( 0 ) ) {
							saveEntitiesElement.item( 0 ).click();
						}
					}, 100 );
				}, 200 );
			}

			if ( response.message === 'fsestudio_themejson_changed' ) {
				// If the FSE Studio apps tells us the themejson file has been updated, put a notice that the editor should be refreshed.
				clearTimeout( fsestudioThemeJsonChangeDebounce );
				fsestudioThemeJsonChangeDebounce = setTimeout( () => {
					wp.data.dispatch( 'core/notices' ).createNotice(
						'warning', // Can be one of: success, info, warning, error.
						"FSE Studio: The values in this theme's theme.json file have changed. To experience them accurately, you will need to refresh this editor.", // Text string to display.
						{
							isDismissible: false, // Whether the user can dismiss the notice.
							// Any actions the user can perform.
							actions: [
								{
									url: '',
									label: 'Refresh Editor',
								},
							],
						}
					);
				}, 200 );
			}
			if ( response.message === 'fsestudio_click_template_parts' ) {
				// Trigger a click event on the "Template Parts" button in the site editor.
				const element = document.querySelectorAll(
					"a[href='" +
						fsestudio.siteUrl +
						"/wp-admin/themes.php?page=gutenberg-edit-site&postType=wp_template_part&fsestudio_app=1']"
				);

				if ( element.item( 0 ) ) {
					element.item( 0 ).click();
				}
			}
			if ( response.message === 'fsestudio_click_templates' ) {
				// Trigger a click event on the "Template Parts" button in the site editor.
				const element = document.querySelectorAll(
					"a[href='" +
						fsestudio.siteUrl +
						"/wp-admin/themes.php?page=gutenberg-edit-site&postType=wp_template&fsestudio_app=1']"
				);

				if ( element.item( 0 ) ) {
					element.item( 0 ).click();
				}
			}
		} catch ( e ) {
			// Message posted was not JSON, so do nothing.
		}
	},
	false
);
