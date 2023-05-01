/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { patternManager } from '../../globals';
import wpeLogoDefaultCropped from '../../../../img/WPE-LOGO-S-Default-Cropped.svg';

export default function Header() {
	return (
		<div className="pattern-manager-header-container">
			<div className="header-container-logo">
				<img
					alt={ __( 'WP Engine logo', 'pattern-manager' ) }
					className="logo-svg"
					aria-hidden="true"
					src={ wpeLogoDefaultCropped }
				/>
				<h1 className="logo-title">
					{ __( 'Pattern Manager', 'pattern-manager' ) }
				</h1>
			</div>
			<div className="header-container-inner">
				<Button
					variant="primary"
					href={ `${ patternManager.siteUrl }/wp-admin/post-new.php?post_type=pm_pattern` }
				>
					{ __( 'Create New Pattern', 'pattern-manager' ) }
				</Button>
			</div>
		</div>
	);
}
