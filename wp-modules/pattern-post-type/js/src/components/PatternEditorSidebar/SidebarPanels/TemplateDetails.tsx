import { __, sprintf } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow } from '@wordpress/components';

import type { BaseSidebarProps } from '../types';

export default function TemplateDetails( {
	postMeta,
}: Pick< BaseSidebarProps, 'postMeta' > ) {
	return (
		<PluginDocumentSettingPanel
			className="fsestudio-template-details"
			title={ __( 'Template Details', 'fse-studio' ) }
			icon="edit"
		>
			<PanelRow>
				{ sprintf(
					/* translators: %s is the post meta title */
					__( 'Template: %s', 'fse-studio' ),
					postMeta.title
				) }
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}
