import { __ } from '@wordpress/i18n';
import { PanelRow, ToggleControl } from '@wordpress/components';

import type { BaseToggleTypes } from './types';

export default function InserterToggle( {
	postMeta,
	handleChange,
}: BaseToggleTypes ) {
	const isChecked = postMeta?.inserter ?? true;

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Display in inserter', 'fse-studio' ) }
				checked={ isChecked }
				help={
					isChecked
						? __( 'Appears in the inserter', 'fse-studio' )
						: __( 'Hidden in the inserter', 'fse-studio' )
				}
				onChange={ ( event ) => {
					handleChange( 'inserter', event );
				} }
			/>
		</PanelRow>
	);
}
