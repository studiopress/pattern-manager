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
	)
		return null; // Will only render component for post type 'post'

	const postMeta = wp.data
		.select( 'core/editor' )
		.getEditedPostAttribute( 'meta' );

	return (
		<div id={ coreLastUpdate }>
			<PluginDocumentSettingPanel
				title={ __( 'Pattern Settings', 'fse-studio' ) }
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
function changePublishToSavePattern( translation, text ) {
	if ( text === 'Publish' ) {
		return 'Save pattern to file';
	}
	if ( text === 'Saved' ) {
		return 'Saved to your theme directory';
	}
	if ( text === 'Post published.' || text === 'Post updated.' ) {
		return 'Pattern saved to disk';
	}
	if ( text === 'Update' || text === 'Post updated.' ) {
		return 'Update Pattern';
	}
	if ( text === 'Add New Tag' ) {
		return 'Pattern Categories';
	}

	return translation;
}

wp.hooks.addFilter(
	'i18n.gettext',
	'fse-studio/change-publish-to-save-pattern',
	changePublishToSavePattern
);

// Tell the parent page (fse studio) that we are loaded.
let fsestudioPatternEditorLoaded = false;
let fsestudioPatternSavedDeBounce = null;

wp.data.subscribe( () => {
	if ( ! fsestudioPatternEditorLoaded ) {
		window.parent.postMessage( 'fsestudio_pattern_editor_loaded' );
		fsestudioPatternEditorLoaded = true;
	}

	if ( wp.data.select( 'core/editor' ).isSavingPost() ) {
		const postMeta = wp.data
			.select( 'core/editor' )
			.getEditedPostAttribute( 'meta' );
		clearTimeout( fsestudioPatternSavedDeBounce );
		fsestudioPatternSavedDeBounce = setTimeout( () => {
			window.parent.postMessage(
				JSON.stringify( {
					message: 'fsestudio_pattern_saved',
					blockPatternData: {
						title: postMeta.title,
						name: postMeta.name,

						content: wp.data
							.select( 'core/editor' )
							.getEditedPostAttribute( 'content' ),
						type: postMeta.type,

						categories: wp.data
							.select( 'core/editor' )
							.getEditedPostAttribute( 'tags' ),
					},
				} )
			);
		}, 1000 );
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
				}, 2000 );
			}
		} catch ( e ) {
			// Message posted was not JSON, so do nothing.
		}
	},
	false
);
