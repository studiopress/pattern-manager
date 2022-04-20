// @ts-check

import '../../css/src/index.scss';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { RadioControl, PanelRow } from '@wordpress/components';

const FseStudioMetaControls = () => {
	// @ts-ignore
	if (
		'fsestudio_pattern' !==
		wp.data.select( 'core/editor' ).getCurrentPostType()
	)
		return null; // Will only render component for post type 'post'

	// @ts-ignore
	const postMeta = wp.data
		.select( 'core/editor' )
		.getEditedPostAttribute( 'meta' );

	return (
		<PluginDocumentSettingPanel
			title={ __( 'Pattern Settings', 'txtdomain' ) }
			icon="edit"
		>
			<PanelRow>
				<RadioControl
					label="Pattern Type"
					help="The type of the pattern this is"
					// @ts-ignore
					selected={ postMeta.type }
					options={ [
						{ label: 'Default', value: 'default' },
						{ label: 'Custom', value: 'custom' },
					] }
					onChange={ ( value ) => {
						// @ts-ignore
						wp.data
							.dispatch( 'core/editor' )
							.editPost( { meta: { _my_custom_text: value } } );
					} }
				/>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin( 'my-custom-postmeta-plugin', {
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
		return 'Saved to your wp-content/fsestudio-custom-patterns/ directory';
	}
	if ( text === 'Post published.' || text === 'Post updated.' ) {
		return 'Pattern saved to disk';
	}
	if ( text === 'Update' || text === 'Post updated.' ) {
		return 'Update Pattern';
	}
	if ( text === 'Tags' ) {
		return 'Pattern Categories';
	}

	return translation;
}
// @ts-ignore
wp.hooks.addFilter(
	'i18n.gettext',
	'fse-studio/change-publish-to-save-pattern',
	changePublishToSavePattern
);

// Tell the parent page (fse studio) that we are loaded.
let fsestudioPatternEditorLoaded = false;
let fsestudioPatternSavedDeBounce = null;
// @ts-ignore
wp.data.subscribe( () => {
	if ( ! fsestudioPatternEditorLoaded ) {
		window.parent.postMessage( 'fsestudio_pattern_editor_loaded' );
		fsestudioPatternEditorLoaded = true;
	}
	// @ts-ignore
	if ( wp.data.select( 'core/editor' ).isSavingPost() ) {
		// @ts-ignore
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
						// @ts-ignore
						content: wp.data
							.select( 'core/editor' )
							.getEditedPostAttribute( 'content' ),
						type: postMeta.type,
						// @ts-ignore
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
					// @ts-ignore
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
