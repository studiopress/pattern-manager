import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { ReverseTooltip } from '../Tooltips';

import type { ToggleTypes } from './types';

export default function ModalToggle( { postMeta, handleChange }: ToggleTypes ) {
	const blockTypeForModal = 'core/post-content';
	const isDisabled = ! postMeta.postTypes?.length;
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
		event: boolean,
		metaKey: string,
		value: string
	) {
		handleChange( metaKey, [
			...( event && ! postMeta[ metaKey ]?.includes( value )
				? [ ...postMeta[ metaKey ], value ]
				: postMeta[ metaKey ].filter(
						( metaValue ) => metaValue !== value
				  ) ),
		] );
	}

	return (
		<div className="fsestudio-post-type-modal-toggle">
			<PanelRow key={ `fse-pattern-visibility-block-content` }>
				<ToggleControl
					label={
						<ReverseTooltip
							helperText="Show this pattern in a modal when new posts of selected post types are created."
							helperTitle="Modal visibility"
						/>
					}
					disabled={ isDisabled }
					checked={ isChecked && ! isDisabled }
					help={
						isChecked
							? __(
									'Enabled for selected post types.',
									'fse-studio'
							  )
							: __( 'Disabled for all post types.', 'fse-studio' )
					}
					onChange={ ( event ) => {
						handleToggleChangeMulti(
							event,
							'blockTypes',
							blockTypeForModal
						);
					} }
				/>
			</PanelRow>
		</div>
	);
}
