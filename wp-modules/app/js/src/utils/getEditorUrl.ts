import { patternManager } from '../globals';

export default function getEditorUrl( patternSlug: string ) {
	return `${
		patternManager.siteUrl
	}/wp-admin/post-new.php?post_type=pm_pattern&slug=${ encodeURIComponent(
		patternSlug
	) }`;
}
