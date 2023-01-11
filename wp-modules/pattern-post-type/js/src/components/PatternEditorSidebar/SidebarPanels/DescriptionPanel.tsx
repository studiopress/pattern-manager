import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { TextareaControl } from '@wordpress/components';

import type { BaseSidebarProps } from '../types';

/**
 * The panel section for typing a description of the pattern.
 */
export default function DescriptionPanel( {
	postMeta,
	handleChange,
}: BaseSidebarProps ) {
	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-description"
			title={ __( 'Expanded Description', 'pattern-manager' ) }
		>
			<TextareaControl
				id="patternmanager-pattern-editor-description-textarea"
				help={ __(
					'Optionally describe the pattern.',
					'pattern-manager'
				) }
				value={ postMeta?.description }
				onChange={ ( newValue ) => {
					handleChange( 'description', newValue );
				} }
			/>
		</PluginDocumentSettingPanel>
	);
}
