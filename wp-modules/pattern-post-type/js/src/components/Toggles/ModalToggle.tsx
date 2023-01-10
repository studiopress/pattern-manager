import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { ReverseTooltip } from '../Tooltips';

import type { ToggleTypes } from './types';

export default function ModalToggle( { postMeta, handleChange }: ToggleTypes ) {
	const blockTypeForModal = 'core/post-content';
	const isDisabled = ! postMeta.postTypes?.length || ! postMeta.inserter;
	const isChecked = postMeta.blockTypes?.includes( blockTypeForModal );

	// Conditionally remove blockTypeForModal from postMeta.blockTypes.
	useEffect( () => {
		if ( isDisabled && isChecked ) {
			handleToggleChangeMulti( false, 'blockTypes', blockTypeForModal );
		}
	}, [ isDisabled, isChecked, blockTypeForModal ] );

	/**
	 * Handler for ToggleControl component changes, targeting postMeta array values.
	 *
	 * If the event is truthy and the value does not currently exist in the targeted
	 * postMeta array, the value is added to a new array.
	 *
	 * Otherwise, the value is filtered out of a new array.
	 */
	function handleToggleChangeMulti(
		toggleEvent: boolean,
		metaKey: string,
		metaValue: string
	) {
		handleChange( metaKey, [
			...( toggleEvent && ! postMeta[ metaKey ]?.includes( metaValue )
				? [ ...postMeta[ metaKey ], metaValue ]
				: postMeta[ metaKey ].filter(
						( existingValue ) => existingValue !== metaValue
				  ) ),
		] );
	}

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
					handleToggleChangeMulti(
						value,
						'blockTypes',
						blockTypeForModal
					);
				} }
			/>
		</PanelRow>
	);
}
