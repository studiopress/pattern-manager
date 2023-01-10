import { Tooltip, Dashicon } from '@wordpress/components';
import type { TooltipTypes } from './types';

export default function ReverseTooltip({
	helperText,
	helperTitle,
	icon = 'info-outline',
}: TooltipTypes) {
	return (
		<div className="patternmanager-pattern-sidebar-reverse-tooltip">
			<Tooltip text={helperText} delay="200">
				<div>
					<span id="tooltip-icon-helper-text">{helperTitle}</span>
					<Dashicon icon={icon} />
				</div>
			</Tooltip>
		</div>
	);
}
