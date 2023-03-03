import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { ReverseTooltip } from '../Tooltips';

import type { ToggleTypes, AdditionalToggleTypes } from './types';

export default function InserterToggle( {
	postMeta,
	handleChange,
	isEditedPostNew,
}: ToggleTypes & Pick< AdditionalToggleTypes, 'isEditedPostNew' > ) {
	const isDefaultChecked = useRef( isEditedPostNew );
	const isChecked = postMeta?.inserter ?? true;

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
				checked={ isDefaultChecked.current || isChecked }
				help={
					isChecked
						? __( 'Appears in the inserter', 'pattern-manager' )
						: __( 'Hidden in the inserter', 'pattern-manager' )
				}
				onChange={ ( value: boolean ) => {
					if ( isDefaultChecked.current === true ) {
						isDefaultChecked.current = false;
					}

					handleChange( 'inserter', value );
				} }
			/>
		</PanelRow>
	);
}
