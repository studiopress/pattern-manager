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
			status="info"
			onRemove={ () => setIsVisible( false ) }
		>
			No version control detected for this theme.{ ' ' }
			<a href="https://github.com/git-guides">Learn about git</a> and set
			it up in the <span>{ patternManager.themeName }</span> theme folder.
		</Notice>
	) : null;
}
