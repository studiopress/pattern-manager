import { patternManager } from '../globals';

export default function getEditorUrl( patternName: string ) {
	const url = new URL( `${ patternManager.siteUrl }/wp-admin/post-new.php` );
	url.searchParams.append( 'post_type', 'pm_pattern' );

	return url.toString();
}
