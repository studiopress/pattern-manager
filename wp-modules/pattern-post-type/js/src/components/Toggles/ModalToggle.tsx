import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { ReverseTooltip } from '../Tooltips';

export function ModalToggle( { postMeta, handleChange } ) {
	const blockTypeForModal = 'core/post-content';
	const isDisabled = ! postMeta.postTypes?.length;
	const isChecked = postMeta.blockTypes?.includes( blockTypeForModal );

	// Conditionally remove blockTypeForModal from postMeta.blockTypes.
	useEffect( () => {
		if ( isDisabled && isChecked ) {
			handleChange( false, 'blockTypes', blockTypeForModal );
		}
	}, [ isDisabled, isChecked, blockTypeForModal ] );

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
						handleChange( event, 'blockTypes', blockTypeForModal );
					} }
				/>
			</PanelRow>
		</div>
	);
}
