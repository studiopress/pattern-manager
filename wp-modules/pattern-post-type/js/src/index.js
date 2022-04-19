/* global wp */

// @ts-check

import '../../css/src/index.scss';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { RadioControl, PanelRow } from '@wordpress/components';
 
const FseStudioMetaControls = () => {
	const { getCurrentPostType, getEditedPostAttribute } = useSelect( ( select ) => {
		const {
			getCurrentPostType,
			getEditedPostAttribute,
		} = select( 'core/editor' );
		
		return {
			getCurrentPostType,
			getEditedPostAttribute
		}
	} );
	const { editPost } = useDispatch( 'core/editor' );

	if ( 'fsestudio_pattern' !== getCurrentPostType() ) return null;  // Will only render component for post type 'post'
	
	const postMeta = getEditedPostAttribute( 'meta' );

	return(
		<PluginDocumentSettingPanel title={ __( 'Pattern Settings', 'txtdomain') } icon="edit">
			<PanelRow>
				<RadioControl
					label="Pattern Type"
					help="The type of the pattern this is"
					selected={ postMeta.type }
					options={ [
						{ label: 'Default', value: 'default' },
						{ label: 'Custom', value: 'custom' },
					] }
					onChange={ ( value ) => {
						editPost( { meta: { _my_custom_text: value } } );
					} }
				/>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'my-custom-postmeta-plugin', {
	icon: null,
	render: () => { return ( <FseStudioMetaControls /> ) },
	
} );

// Change the word "Publish" to "Save Pattern"
function changePublishToSavePattern( translation, text, domain ) {
	if ( text === 'Publish' ) {
		return 'Save pattern to file';
	}
	if ( text === 'Saved' ) {
		return 'Saved to your wp-content/fsestudio-custom-patterns/ directory';
	}
	if ( text === 'Post published.' ||  text === 'Post updated.' ) {
		return 'Pattern saved to disk';
	}
	if ( text === 'Update' ||  text === 'Post updated.' ) {
		return 'Update Pattern';
	}
	
	return translation;
}
wp.hooks.addFilter(
	'i18n.gettext',
	'fse-studio/change-publish-to-save-pattern',
	changePublishToSavePattern
);

// Tell the parent page (fse studio) that we are loaded.
let fsestudio_pattern_editor_loaded = false;
wp.data.subscribe(() => {
	if ( ! fsestudio_pattern_editor_loaded ) {
		window.parent.postMessage("fsestudio_pattern_editor_loaded");
		fsestudio_pattern_editor_loaded = true;
	}
	if ( wp.data.select( 'core/editor' ).isSavingPost() ) {
		window.parent.postMessage(
			JSON.stringify( {
				message: "fsestudio_pattern_saved",
				blockPatternData: {
					title:
					name:
					content:
					type:
					categories:
				}
			} )
		);
	}
});

