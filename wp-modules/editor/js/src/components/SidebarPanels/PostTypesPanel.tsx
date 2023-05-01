import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Spinner } from '@wordpress/components';
import Select from 'react-select';
import { HelperTooltip, ReverseTooltip } from '../Tooltips';

import type { BaseSidebarProps, AdditionalSidebarProps } from './types';
import type { ReactNode } from 'react';

/**
 * The panel section for restricting post types for the pattern.
 * Custom post types and certain core types are displayed as toggles.
 */
export default function PostTypesPanel( {
	blockTypes,
	children,
	postTypeOptions,
	postTypes,
	handleChange,
}: BaseSidebarProps< 'postTypes' | 'blockTypes' > &
	AdditionalSidebarProps< 'postTypeOptions' > & {
		children: ReactNode;
	} ) {
	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-post-types"
			title={ __( 'Post Types', 'pattern-manager' ) }
		>
			<HelperTooltip
				helperText={ __(
					'With no selections, this pattern will be available in the block inserter for all post types.',
					'pattern-manager'
				) }
				helperTitle={ __( 'Allowed post types', 'pattern-manager' ) }
			/>
			{ postTypeOptions ? (
				<Select
					isMulti
					isClearable
					closeMenuOnSelect={ false }
					aria-label={ __( 'Select post types', 'pattern-manager' ) }
					value={ postTypes?.map( ( postType ) => {
						return {
							...postTypeOptions.find(
								( matchedPostType ) =>
									matchedPostType.value === postType
							),
							// Conditionally make wp_template post type non-removable.
							// Add a custom label with Tooltip.
							...( ( postType === 'wp_template' &&
								blockTypes?.some( ( blockType ) =>
									blockType.includes( 'core/template-part' )
								) && {
									label: (
										<ReverseTooltip
											helperText={ __(
												'Required for "core/template-part" transforms (block types).',
												'pattern-manager'
											) }
											helperTitle={ __(
												'Templates',
												'pattern-manager'
											) }
											icon="lock"
										/>
									),
									isFixed: true,
								} ) ||
								'' ),
						};
					} ) }
					options={ postTypeOptions }
					onChange={ ( postTypeSelections ) => {
						handleChange(
							'postTypes',
							postTypeSelections.map(
								( postType ) => postType.value
							)
						);
					} }
					menuPlacement="auto"
					styles={ {
						menu: ( base ) => ( {
							...base,
							// Without this z-index value, the dropdown is transparent.
							zIndex: 100,
						} ),
						multiValue: ( base, state ) => {
							return state.data.isFixed
								? { ...base, backgroundColor: 'gray' }
								: base;
						},
						multiValueLabel: ( base, state ) => {
							return state.data.isFixed
								? {
										...base,
										fontWeight: 'bold',
										color: 'white',
										paddingRight: 6,
								  }
								: base;
						},
						multiValueRemove: ( base, state ) => {
							return state.data.isFixed
								? { ...base, display: 'none' }
								: base;
						},
					} }
				/>
			) : (
				<Spinner />
			) }
			{ children }
		</PluginDocumentSettingPanel>
	);
}
