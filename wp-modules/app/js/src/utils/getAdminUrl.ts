import { patternManager } from '../globals';

export default function getAdminUrl( queryParams: {
	[ key: string ]: string;
} ) {
	const url = new URL( `${ patternManager.siteUrl }/wp-admin/admin.php` );
	url.searchParams.append( 'post_type', 'pm_pattern' );
	Object.keys( queryParams ).forEach( ( key ) => {
		url.searchParams.append( key, queryParams[ key ] );
	} );

	return url.toString();
}
