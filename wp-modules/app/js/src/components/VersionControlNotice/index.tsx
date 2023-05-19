// WP dependencies
import { __ } from '@wordpress/i18n';
import { Notice } from '@wordpress/components';

type Props = {
	isVisible: boolean;
	handleDismiss: () => void;
};

/** Display a notice if no version control is detected in the theme. */
export default function VersionControlNotice( {
	isVisible,
	handleDismiss,
}: Props ) {
	return isVisible ? (
		<Notice
			className="patternmanager-version-control-notice"
			isDismissible
			status="warning"
			onRemove={ handleDismiss }
		>
			{ __(
				'No version control detected for this theme. We recommend adding version control so you do not lose your patterns during theme updates.',
				'pattern-manager'
			) }
		</Notice>
	) : null;
}
