import { patternManager } from '../globals';

export default function getEditorUrl( patternName: string ) {
	return `${
		patternManager.siteUrl
	}/wp-admin/post-new.php?post_type=pm_pattern&name=${ encodeURIComponent(
		patternName
	) }`;
}
