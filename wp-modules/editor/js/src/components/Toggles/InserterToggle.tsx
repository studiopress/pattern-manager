import { __ } from '@wordpress/i18n';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { ReverseTooltip } from '../Tooltips';

import type { ToggleTypes } from './types';

export default function InserterToggle( {
	postMeta,
	handleChange,
}: ToggleTypes ) {
	const isChecked = postMeta?.inserter;

	return (
		<PanelRow className="patternmanager-inserter-toggle">
			<ToggleControl
				label={
					! isChecked && postMeta?.postTypes?.length ? (
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
