/**
 * WordPress dependencies
 */
import { Button, Fill, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { wordpress } from '@wordpress/icons';
import { patternManager } from '../../globals';

export default function BackButton() {
	return (
		<Fill name="__experimentalMainDashboardButton">
			<Button
				className="edit-post-fullscreen-mode-close"
				label={ __( 'Back to Patterns', 'pattern-manager' ) }
				showTooltip={ true }
				href={ `${ patternManager.siteUrl }/wp-admin/admin.php?page=pattern-manager` }
			>
				<Icon size="36px" icon={ wordpress } />
			</Button>
		</Fill>
	);
}
