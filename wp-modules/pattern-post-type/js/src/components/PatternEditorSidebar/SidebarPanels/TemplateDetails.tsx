import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow } from '@wordpress/components';

export function TemplateDetails( { postMeta } ) {
	return (
		<PluginDocumentSettingPanel
			className="fsestudio-template-details"
			title={ __( 'Template Details', 'fse-studio' ) }
			icon="edit"
		>
			<PanelRow>
				{ __( 'Template:', 'fse-studio' ) + ' ' + postMeta.title }
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}
