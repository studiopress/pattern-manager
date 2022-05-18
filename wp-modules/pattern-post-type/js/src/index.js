import '../../css/src/index.scss';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

const FseStudioMetaControls = () => {
	const [ coreLastUpdate, setCoreLastUpdate ] = useState();

	useEffect( () => {
		wp.data.subscribe( () => {
			setCoreLastUpdate( Date.now() );
		} );
	}, [] );

	if (
		'fsestudio_pattern' !==
		wp.data.select( 'core/editor' ).getCurrentPostType()
	) {
		return null; // Will only render component for post type 'fsestudio_pattern'
	}

	const postMeta = wp.data
		.select( 'core/editor' )
		.getEditedPostAttribute( 'meta' );
	
	if ( postMeta?.type === 'template' ) {
		return <div id={ coreLastUpdate }>
			<PluginDocumentSettingPanel
				className='fsestudio-template-details'
				title={ __( 'Template Details', 'fse-studio' ) }
				icon="edit"
			>
				<PanelRow>
					{ __( 'Template:', 'fse-studio' ) + ' ' + postMeta.title }
				</PanelRow>
			</PluginDocumentSettingPanel>
		</div>;
	}

	return (
		<div id={ coreLastUpdate }>
			<PluginDocumentSettingPanel
				title={  __( 'Pattern Settings', 'fse-studio' ) }
				icon="edit"
			>
				<PanelRow>
					<TextControl
						label={ __( 'Pattern Name', 'fse-studio' ) }
						value={ postMeta.title }
						onChange={ ( value ) => {
							wp.data.dispatch( 'core/editor' ).editPost( {
								meta: { ...postMeta, title: value },
							} );
						} }
					/>
				</PanelRow>
			</PluginDocumentSettingPanel>
		</div>
	);
};

registerPlugin( 'fsestudio-postmeta-for-patterns', {
	icon: null,
	render: () => {
		return <FseStudioMetaControls />;
	},
} );

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
let fsestudioBlockPatternEditorIsSaving = false;
wp.data.subscribe( () => {
	if ( ! fsestudioPatternEditorLoaded ) {
		window.parent.postMessage( 'fsestudio_pattern_editor_loaded' );
		fsestudioPatternEditorLoaded = true;
	}

	// If saving just started, set a flag.
	if ( wp.data.select( 'core/editor' ).isSavingPost() && ! fsestudioBlockPatternEditorIsSaving) {
		fsestudioBlockPatternEditorIsSaving = true;
	}
	if ( ! wp.data.select( 'core/editor' ).isSavingPost() && fsestudioBlockPatternEditorIsSaving ) {
		window.parent.postMessage( 'fsestudio_pattern_editor_save_complete' );
		fsestudioBlockPatternEditorIsSaving = false;
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
					wp.data
						.dispatch( 'core/editor' )
						.savePost()
						.then( () => {
							window.location.reload();
						} );
				}, 100 );
			}
			
			if ( response.message === 'fsestudio_save' ) {
				// If the FSE Studio apps tells us to save the current post, do it:
				clearTimeout( fsestudioSaveDebounce );
				fsestudioSaveDebounce = setTimeout( () => {
					wp.data
						.dispatch( 'core/editor' )
						.savePost();
				}, 200 );
			}
			
			
			if ( response.message === 'fsestudio_themejson_changed' ) {
				// If the FSE Studio apps tells us the themejson file has been updated, put a notice that the editor should be refreshed.
				clearTimeout( fsestudioThemeJsonChangeDebounce );
				fsestudioThemeJsonChangeDebounce = setTimeout( () => {

					wp.data.dispatch( 'core/notices' ).createNotice(
						'warning', // Can be one of: success, info, warning, error.
						'FSE Studio: The values in this theme\'s theme.json file have changed. To experience them accurately, you will need to refresh this editor.', // Text string to display.
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

		} catch ( e ) {
			// Message posted was not JSON, so do nothing.
		}
	},
	false
);
