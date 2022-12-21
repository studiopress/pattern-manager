import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { TextareaControl } from '@wordpress/components';

import { PostMeta } from '../../../types';

type Props = {
	postMeta: PostMeta;
	handleChange: (
		metaKey: 'description',
		newValue: PostMeta[ 'description' ]
	) => void;
};

/**
 * The panel section for typing a description of the pattern.
 */
export default function DescriptionPanel( { postMeta, handleChange }: Props ) {
	return (
		<PluginDocumentSettingPanel
			name="fsestudio-pattern-editor-pattern-description"
			title={ __( 'Expanded Description', 'fse-studio' ) }
		>
			<TextareaControl
				id="fsestudio-pattern-editor-description-textarea"
				help={ __( 'Optionally describe the pattern.', 'fse-studio' ) }
				value={ postMeta?.description }
				onChange={ ( newValue ) => {
					handleChange( 'description', newValue );
				} }
			/>
		</PluginDocumentSettingPanel>
	);
}
