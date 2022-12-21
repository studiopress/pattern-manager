import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Spinner } from '@wordpress/components';
import Select from 'react-select';
import { HelperTooltip } from '../../Tooltips';

import { PostMeta, SelectOptions } from '../../../types';

type Props = {
	postMeta: PostMeta;
	blockTypes: SelectOptions;
	handleChange: (
		metaKey: 'blockTypes',
		newValue: PostMeta[ 'blockTypes' ]
	) => void;
};

/**
 * The panel section for assigning block types to the pattern.
 * Block types in the pattern file are primarily used for transforming blocks.
 */
export function TransformsPanel( {
	postMeta,
	blockTypes,
	handleChange,
}: Props ) {
	return (
		<PluginDocumentSettingPanel
			name="fsestudio-pattern-editor-pattern-transforms"
			title={ __( 'Transforms (Block Types)', 'fse-studio' ) }
		>
			<HelperTooltip
				helperText={ __(
					'Select the blocks that users can transform into this pattern.',
					'fse-studio'
				) }
				helperTitle={ __( 'Blocks for transformation', 'fse-studio' ) }
			/>
			{ blockTypes ? (
				<Select
					isMulti
					isClearable
					closeMenuOnSelect={ false }
					value={ postMeta?.blockTypes?.map( ( blockType ) => {
						// Hide block type related to the post type modal.
						if ( blockType === 'core/post-content' ) {
							return null;
						}

						return blockTypes.find(
							( matchedBlocktype ) =>
								matchedBlocktype.value === blockType
						);
					} ) }
					options={ blockTypes }
					onChange={ ( blockTypeSelections ) => {
						handleChange(
							'blockTypes',
							blockTypeSelections.map(
								( blockTypeObject ) => blockTypeObject.value
							)
						);
					} }
					menuPlacement="auto"
					styles={ {
						menu: ( base ) => ( {
							...base,
							zIndex: 100,
						} ),
					} }
				/>
			) : (
				<Spinner />
			) }
		</PluginDocumentSettingPanel>
	);
}
