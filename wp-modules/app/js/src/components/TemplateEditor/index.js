// WP Dependencies

// @ts-check
import { __ } from '@wordpress/i18n';

// Hooks
import useStudioContext from '../../hooks/useStudioContext';

// Globals
import { fsestudio } from '../../globals';

export default function TemplateEditor() {
	const { templateEditorIframe, currentTheme } = useStudioContext();

	if ( ! currentTheme?.existsOnDisk ) {
		return '';
	}

	return (
		<iframe
			title={ __( 'Pattern Editor', 'fse-studio' ) }
			ref={ templateEditorIframe }
			style={ {
				width: '100%',
				height: 'calc(100vh - 80px)',
			} }
			src={
				fsestudio.siteUrl +
				'/wp-admin/themes.php?page=gutenberg-edit-site&postType=wp_template&fsestudio_app=1'
			}
		/>
	);
}
