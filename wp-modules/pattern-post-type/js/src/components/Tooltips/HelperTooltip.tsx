import { Tooltip, Dashicon } from '@wordpress/components';
import { IconKey } from '@wordpress/components/src/dashicon/types';

type Props = {
	helperText: string;
	helperTitle: string;
	icon?: IconKey;
};

export function HelperTooltip( {
	helperText,
	helperTitle,
	icon = 'info-outline',
}: Props ) {
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
