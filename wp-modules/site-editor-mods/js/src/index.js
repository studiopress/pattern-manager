/* global patternmanager */
import '../../css/src/index.scss';

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
wp.hooks.addFilter( 'i18n.gettext', 'pattern-manager/changeWords', changeWords );

wp.hooks.removeFilter(
	'blockEditor.__unstableCanInsertBlockType',
	'removeTemplatePartsFromInserter'
);

let patternmanagerSiteEditorIsUnsaved = false;
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
		window.parent.postMessage( 'patternmanager_site_editor_dirty' );
		patternmanagerSiteEditorIsUnsaved = true;
	}

	// If saving was just completed, trigger message to patternmanager app.
	if (
		wp.data.select( 'core' ).__experimentalGetDirtyEntityRecords()
			.length === 0 &&
		patternmanagerSiteEditorIsUnsaved
	) {
		// If a successful save was just completed, send a message to the patternmanager app in the parent iframe.
		patternmanagerSiteEditorIsUnsaved = false;
		window.parent.postMessage( 'patternmanager_site_editor_save_complete' );
	}
} );

let patternmanagerSaveDebounce = null;
let patternmanagerThemeJsonChangeDebounce = null;
// If the Pattern Manager app sends an instruction, listen for and do it here.
window.addEventListener(
	'message',
	( event ) => {
		try {
			const response = JSON.parse( event.data );

			if ( response.message === 'patternmanager_save' ) {
				// If the Pattern Manager apps tells us to save the current post, do it:
				clearTimeout( patternmanagerSaveDebounce );
				patternmanagerSaveDebounce = setTimeout( () => {
					// Trigger a click event on the "Save" button in the site editor.
					const element = document.getElementsByClassName(
						'edit-site-save-button__button'
					);

					if ( element.item( 0 ) ) {
						element.item( 0 ).click();
					}

					// Once the panel has been opened, click on the save button in the "are you sure" pop out panel.
					setTimeout( () => {
						const saveEntitiesElement =
							document.getElementsByClassName(
								'editor-entities-saved-states__save-button'
							);
						if ( saveEntitiesElement.item( 0 ) ) {
							saveEntitiesElement.item( 0 ).click();
						}
					}, 100 );
				}, 200 );
			}

			if ( response.message === 'patternmanager_hotswapped_theme' ) {
				// If the Pattern Manager apps tells us the themejson file has been updated, put a notice that the editor should be refreshed.
				clearTimeout( patternmanagerThemeJsonChangeDebounce );
				patternmanagerThemeJsonChangeDebounce = setTimeout( () => {
					wp.data.dispatch( 'core/notices' ).createNotice(
						'warning', // Can be one of: success, info, warning, error.
						'Pattern Manager: The theme selection has changed. To display accurate style options, please refresh this editor.', // Text string to display.
						{
							id: 'pattern-manager-refresh-site-editor-hotswap-notice',
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

			if (
				response.message === 'patternmanager_themejson_changed' ||
				response.message === 'patternmanager_stylejson_changed'
			) {
				// If the Pattern Manager apps tells us the themejson file has been updated, put a notice that the editor should be refreshed.
				clearTimeout( patternmanagerThemeJsonChangeDebounce );
				patternmanagerThemeJsonChangeDebounce = setTimeout( () => {
					wp.data.dispatch( 'core/notices' ).createNotice(
						'warning', // Can be one of: success, info, warning, error.
						"Pattern Manager: The values in this theme's theme.json or style variation files have changed. To experience them accurately, you will need to refresh this editor.", // Text string to display.
						{
							id: 'pattern-manager-refresh-site-editor-theme-json-notice',
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

			if ( response.message === 'patternmanager_click_template_parts' ) {
				// Trigger a click event on the "Template Parts" button in the site editor.
				const element = document.querySelectorAll(
					"a[href='" +
						patternmanager.siteUrl +
						"/wp-admin/site-editor.php?postType=wp_template_part&patternmanager_app=1']"
					//"/wp-admin/themes.php?page=gutenberg-edit-site&postType=wp_template_part&patternmanager_app=1']"
				);

				if ( element.item( 0 ) ) {
					element.item( 0 ).click();
				}
			}

			if ( response.message === 'patternmanager_click_templates' ) {
				// Trigger a click event on the "Template Parts" button in the site editor.
				const element = document.querySelectorAll(
					"a[href='" +
						patternmanager.siteUrl +
						"/wp-admin/site-editor.php?postType=wp_template&patternmanager_app=1']"
					//"/wp-admin/themes.php?page=gutenberg-edit-site&postType=wp_template&patternmanager_app=1']"
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
