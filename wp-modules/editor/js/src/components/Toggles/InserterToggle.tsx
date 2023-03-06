import { __ } from '@wordpress/i18n';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { ReverseTooltip } from '../Tooltips';

import type { ToggleProps } from './types';

export default function InserterToggle( {
	inserter,
	postTypes,
	handleChange,
}: ToggleProps< 'inserter' | 'postTypes' > ) {
	const isChecked = inserter ?? true;

	return (
		<PanelRow className="patternmanager-inserter-toggle">
			<ToggleControl
				label={
					! isChecked && postTypes?.length ? (
						<ReverseTooltip
							helperText={ __(
								'Modal visibility selection also depends on this setting.',
								'pattern-manager'
							) }
							helperTitle={ __(
								'Display in inserter',
								'pattern-manager'
							) }
							icon="warning"
						/>
					) : (
						__( 'Display in inserter', 'pattern-manager' )
					)
				}
				checked={ isChecked }
				help={
					isChecked
						? __( 'Appears in the inserter', 'pattern-manager' )
						: __( 'Hidden in the inserter', 'pattern-manager' )
				}
				onChange={ ( value: boolean ) => {
					handleChange( 'inserter', value );
				} }
			/>
		</PanelRow>
	);
}
