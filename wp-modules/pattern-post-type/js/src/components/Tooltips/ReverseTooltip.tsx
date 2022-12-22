import { Tooltip, Dashicon } from '@wordpress/components';
import { IconKey } from '@wordpress/components/src/dashicon/types';

type Props = {
	helperText: string;
	helperTitle: string;
	icon?: IconKey;
};

export default function ReverseTooltip( {
	helperText,
	helperTitle,
	icon = 'info-outline',
}: Props ) {
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
