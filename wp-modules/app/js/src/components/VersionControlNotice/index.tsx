// WP dependencies
import { Notice } from '@wordpress/components';
import { useState } from '@wordpress/element';

// Globals
import { patternManager } from '../../globals';

/** Display a non-dismissible notice if no version control is detected in the theme. */
export default function VersionControlNotice() {
	const [ isVisible, setIsVisible ] = useState( true );

	return ! patternManager.versionControl && isVisible ? (
		<Notice
			className="patternmanager-version-control-notice"
			isDismissible
			status="warning"
			onRemove={ () => setIsVisible( false ) }
		>
			No version control detected for this theme. Learn how to set up git
			for your theme <a href="https://wpengine.com/support/git/">here</a>.
		</Notice>
	) : null;
}
