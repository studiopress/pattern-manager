/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { patternManager } from '../../globals';

export default function SiteNavigation() {
	return (
		<nav>
			{ Object.keys( patternManager?.localSites ).map( ( key, index ) => {
				if ( index > 10 ) {
					// Temporary workaround to only show first 10 sites fo the POC.
					return '';
				}
				const site = patternManager?.localSites[key];
				console.log( 'key', index  )
				return <Button
					// className={'is-pressed'}
				>
					{ site?.name }
				</Button>
			} ) }
		</nav>
	);
}
