// WP dependencies
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
			No version control detected for this theme. Learn how to set up git
			for your theme <a href="https://wpengine.com/support/git/">here</a>.
		</Notice>
	) : null;
}
