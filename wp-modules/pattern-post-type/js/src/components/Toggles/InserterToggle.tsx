import { __ } from '@wordpress/i18n';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { ReverseTooltip } from '../Tooltips';

import type { ToggleTypes } from './types';

export default function InserterToggle( {
	postMeta,
	handleChange,
}: ToggleTypes ) {
	const isChecked = postMeta?.inserter ?? true;

	return (
		<PanelRow className="fsestudio-inserter-toggle">
			<ToggleControl
				label={
					! isChecked && postMeta?.postTypes?.length ? (
						<ReverseTooltip
							helperText={ __(
								'Modal visibility selection also depends on this setting.',
								'fse-studio'
							) }
							helperTitle={ __(
								'Display in inserter',
								'fse-studio'
							) }
							icon="warning"
						/>
					) : (
						__( 'Display in inserter', 'fse-studio' )
					)
				}
				checked={ isChecked }
				help={
					isChecked
						? __( 'Appears in the inserter', 'fse-studio' )
						: __( 'Hidden in the inserter', 'fse-studio' )
				}
				onChange={ ( value: boolean ) => {
					handleChange( 'inserter', value );
				} }
			/>
		</PanelRow>
	);
}
