import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { ReverseTooltip } from '../Tooltips';

import type { ToggleProps } from './types';

export default function ModalToggle( {
	blockTypes,
	inserter,
	postTypes,
	handleChangeMulti,
}: ToggleProps< 'blockTypes' | 'inserter' | 'postTypes' > ) {
	const blockTypeForModal = 'core/post-content';
	const isDisabled = ! postTypes?.length || ! inserter;
	const isChecked = blockTypes?.includes( blockTypeForModal );

	// Conditionally remove blockTypeForModal from blockTypes.
	useEffect( () => {
		if ( isDisabled && isChecked ) {
			handleChangeMulti( false, 'blockTypes', blockTypeForModal );
		}
		// Disable eslint for exhaustive-deps as handleChangeMulti
		// is a stable function and does not need to be included in the dependency array.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isDisabled, isChecked, blockTypeForModal ] );

	return (
		<PanelRow className="patternmanager-post-type-modal-toggle">
			<ToggleControl
				label={
					<ReverseTooltip
						helperText={ __(
							'Show this pattern in a modal when new posts of selected post types are created.',
							'pattern-manager'
						) }
						helperTitle={ __(
							'Modal visibility',
							'pattern-manager'
						) }
					/>
				}
				disabled={ isDisabled }
				checked={ isChecked && ! isDisabled }
				help={
					isChecked
						? __(
								'Enabled for selected post types.',
								'pattern-manager'
						  )
						: __(
								'Disabled for all post types.',
								'pattern-manager'
						  )
				}
				onChange={ ( value: boolean ) => {
					handleChangeMulti( value, 'blockTypes', blockTypeForModal );
				} }
			/>
		</PanelRow>
	);
}
