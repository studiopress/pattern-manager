/**
 * WordPress dependencies
 */
import {useState} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { patternManager } from '../../globals';
import localIcon from '../../../../img/sprite-local.svg';

export default function SiteNavigation({currentTab, setCurrentTab}) {
	return (
		<div style={{
			display:'flex',
			gap: '15px',
			alignItems: 'center',
		}}>
			<span style={{fontWeight: '600'}}>Local Sites:</span>
			<nav>
				{ Object.keys( patternManager?.sites ).map( ( key, index ) => {
					if ( index > 10 ) {
						// Temporary workaround to only show first 10 sites fo the POC.
						//return '';
					}
					const site = patternManager?.sites[ key ].localWpData;
					return (
						<Button
							key={key}
							className="pm-site-nav-button"
							
							type="button"
							
							aria-label={ site?.name }
							aria-pressed={ currentTab === key }
							
							isPressed={ currentTab === key }
							onClick={() => {
								setCurrentTab(key)
							}}
						>
							{ site?.name }
						</Button>
					);
				} ) }
			</nav>
		</div>
	);
}
