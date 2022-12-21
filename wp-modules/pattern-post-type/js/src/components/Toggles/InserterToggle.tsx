import { __ } from '@wordpress/i18n';
import { PanelRow, ToggleControl } from '@wordpress/components';

import { PostMeta } from '../../types';

type Props = {
	postMeta: PostMeta;
	handleChange: (
		metaKey: 'inserter',
		newValue: PostMeta[ 'inserter' ]
	) => void;
};

export function InserterToggle( { postMeta, handleChange }: Props ) {
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
