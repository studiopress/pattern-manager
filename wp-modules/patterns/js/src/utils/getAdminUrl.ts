import { patternManager } from '../globals';

export default function getAdminUrl( queryParams: {
	[ key: string ]: string;
} ) {
	const url = new URL( `${ patternManager.siteUrl }/wp-admin/admin.php` );
	url.searchParams.append( 'post_type', 'pm_pattern' );
	Object.entries( queryParams ).forEach( ( [ key, value ] ) => {
		url.searchParams.append( key, value );
	} );

	return url.toString();
}
