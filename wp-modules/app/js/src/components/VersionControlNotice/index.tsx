// WP dependencies
import { Notice } from '@wordpress/components';

// Globals
import { patternManager } from '../../globals';

/** Display a non-dismissible notice if no version control is detected in the theme. */
export default function VersionControlNotice() {
	return (
		! patternManager.versionControl && (
			<Notice
				className="patternmanager-version-control-notice"
				isDismissible={ false }
				status="error"
			>
				No version control detected for this theme. Please{ ' ' }
				<a href="https://github.com/git-guides">initialize git</a> in
				the <span>{ patternManager.themeName }</span> theme folder.
			</Notice>
		)
	);
}
