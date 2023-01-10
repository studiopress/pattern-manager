import { __ } from '@wordpress/i18n';

// Hooks
import useStudioContext from '../../hooks/useStudioContext';

// Globals
import { patternmanager } from '../../globals';

export default function TemplateEditor() {
	const { templateEditorIframe } = useStudioContext();

	return (
		<iframe
			title={ __( 'Template Editor', 'pattern-manager' ) }
			ref={ templateEditorIframe }
			style={ {
				width: '100%',
				height: 'calc(100vh - 80px)',
			} }
			src={
				patternmanager.siteUrl +
				'/wp-admin/site-editor.php?postType=wp_template&patternmanager_app=1'
				//'/wp-admin/themes.php?page=gutenberg-edit-site&postType=wp_template&patternmanager_app=1'
			}
		/>
	);
}
