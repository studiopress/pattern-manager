// WP Dependencies.
import { __ } from '@wordpress/i18n';

import ViewContainer from '../Common/ViewContainer';
import CreateThemeForm from '../Common/CreateThemeForm';
import SaveTheme from '../Common/SaveTheme';

type Props = {
	isVisible: boolean;
};

export default function CreateTheme({ isVisible }: Props) {
	if (!isVisible) {
		return null;
	}

	return (
		<ViewContainer
			heading={__('Create Your Theme', 'pattern-manager')}
			description={__(
				'To get started, enter a theme name and click Save Theme. Once your theme is created, you can move on to building and customizing your theme.',
				'patternmanager'
			)}
		>
			<CreateThemeForm>
				<SaveTheme displayCancelButton={true} />
			</CreateThemeForm>
		</ViewContainer>
	);
}
