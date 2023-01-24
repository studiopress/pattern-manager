/**
 * WordPress dependencies
 */
import { Button, Fill, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { wordpress } from '@wordpress/icons';

export default function BackButton() {
	return (
		<Fill name="__experimentalMainDashboardButton">
			<Button
				label={ __( 'Back to Patterns', 'pattern-manager' ) }
				showTooltip={ true }
				onClick={ () => {
					window.parent.postMessage( 'pm_back_to_patterns' );
				} }
			>
				<Icon size="36px" icon={ wordpress } />
			</Button>
		</Fill>
	);
}
