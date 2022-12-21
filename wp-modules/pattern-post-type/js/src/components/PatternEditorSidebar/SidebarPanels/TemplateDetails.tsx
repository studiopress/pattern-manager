import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow } from '@wordpress/components';

import { PostMeta } from '../../../types';

type Props = {
	postMeta: PostMeta;
};

export default function TemplateDetails( { postMeta }: Props ) {
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
