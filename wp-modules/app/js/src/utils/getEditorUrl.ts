import { patternManager } from '../globals';

export default function getEditorUrl( patternSlug ) {
	return `${ patternManager.siteUrl }/wp-admin/post-new.php?post_type=pm_pattern&name=${ encodeURIComponent( patternSlug ) }`;
}
