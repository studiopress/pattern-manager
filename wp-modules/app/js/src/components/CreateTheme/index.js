// WP Dependencies.
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';
import ViewContainer from '../Common/ViewContainer';
import CreateThemeForm from '../Common/CreateThemeForm';
import SaveTheme from '../Common/SaveTheme';

/** @param {{isVisible: boolean}} props */
export default function CreateTheme( { isVisible } ) {
	const { currentTheme } = useStudioContext();

	if ( ! currentTheme.data || ! isVisible ) {
		return null;
	}

	return (
		<ViewContainer
			isVisible={ isVisible }
			heading={ __( 'Create Your Theme', 'fse-studio' ) }
			description={ __(
				'To get started, enter a theme name and click Save Your Theme. Once your theme is created, you can move on to building and customizing your theme.',
				'fsestudio'
			) }
		>
			<CreateThemeForm>
				<SaveTheme displayCancelButton={ true } />
			</CreateThemeForm>
		</ViewContainer>
	);
}
