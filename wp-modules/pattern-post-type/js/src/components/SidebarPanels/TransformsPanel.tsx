import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Spinner } from '@wordpress/components';
import Select from 'react-select';
import { HelperTooltip } from '../Tooltips';

import type { BaseSidebarProps, AdditionalSidebarProps } from './types';

/**
 * The panel section for assigning block types to the pattern.
 * Block types in the pattern file are primarily used for transforming blocks.
 */
export default function TransformsPanel( {
	postMeta,
	blockTypes,
	handleChange,
}: BaseSidebarProps & Pick< AdditionalSidebarProps, 'blockTypes' > ) {
	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-transforms"
			title={ __( 'Transforms (Block Types)', 'pattern-manager' ) }
		>
			<HelperTooltip
				helperText={ __(
					'Select the blocks that users can transform into this pattern.',
					'pattern-manager'
				) }
				helperTitle={ __(
					'Blocks for transformation',
					'pattern-manager'
				) }
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
						handleChange( 'blockTypes', [
							...blockTypeSelections.map(
								( blockTypeObject ) => blockTypeObject.value
							),
							// Make sure 'core/post-content' is not removed if it was in postMeta.blockTypes.
							...( ( postMeta?.blockTypes?.includes(
								'core/post-content'
							) && [ 'core/post-content' ] ) ||
								'' ),
						] );
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
