import { Tooltip, Dashicon } from '@wordpress/components';
import type { BaseTooltipTypes } from './types';

export default function ReverseTooltip( {
	helperText,
	helperTitle,
	icon = 'info-outline',
}: BaseTooltipTypes ) {
	return (
		<div className="fsestudio-pattern-sidebar-reverse-tooltip">
			<Tooltip text={ helperText } delay="200">
				<div>
					<span id="tooltip-icon-helper-text">{ helperTitle }</span>
					<Dashicon icon={ icon } />
				</div>
			</Tooltip>
		</div>
	);
}
