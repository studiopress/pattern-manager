import { Tooltip, Dashicon } from '@wordpress/components';

export function HelperTooltip( {
	helperText,
	helperTitle,
	icon = 'info-outline',
} ) {
	return (
		<div className="fsestudio-pattern-sidebar-tooltip">
			<Tooltip text={ helperText } delay="200">
				<div>
					<Dashicon icon={ icon } />
					<span id="tooltip-icon-helper-text">{ helperTitle }</span>
				</div>
			</Tooltip>
		</div>
	);
}
