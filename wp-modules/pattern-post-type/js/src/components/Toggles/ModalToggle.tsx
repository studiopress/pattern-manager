import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { ReverseTooltip } from '../Tooltips';

import type { BaseToggleTypes } from './types';

export default function ModalToggle( {
	postMeta,
	handleChange,
}: BaseToggleTypes ) {
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
	 * Handler for ToggleControl component changes.
	 * Intended to target postMeta values in an array.
	 *
	 * @param {boolean} event The toggle event.
	 * @param {string}  key   The object key to reference in postMeta.
	 * @param {string}  value The value to update or remove from postMeta.
	 */
	function handleToggleChangeMulti( event, key, value ) {
		let updatedValues = [];

		if ( event ) {
			updatedValues = ! postMeta[ key ]?.includes( value )
				? postMeta[ key ]?.concat( [ value ] )
				: postMeta[ key ];
		} else {
			updatedValues = postMeta[ key ]?.includes( value )
				? postMeta[ key ]?.filter( ( item ) => {
						return item !== value;
				  } )
				: postMeta[ key ];
		}

		handleChange( key, updatedValues );
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
