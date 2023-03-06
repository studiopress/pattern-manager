import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Spinner } from '@wordpress/components';
import Select from 'react-select';

import type { BaseSidebarProps, AdditionalSidebarProps } from './types';

/**
 * The panel section for assigning block pattern categories to the pattern.
 * Selected categories will show under the matching dropdown in the site editor.
 */
export default function CategoriesPanel( {
	categories,
	categoryOptions,
	handleChange,
}: BaseSidebarProps< 'categories' > &
	Pick< AdditionalSidebarProps, 'categoryOptions' > ) {
	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-categories"
			title={ __( 'Pattern Categories', 'pattern-manager' ) }
		>
			{ categoryOptions ? (
				<Select
					isMulti
					isClearable
					closeMenuOnSelect={ false }
					aria-label={ __(
						'Add Pattern Categories',
						'pattern-manager'
					) }
					value={ categories?.map( ( category ) =>
						categoryOptions.find(
							( matchedCategory ) =>
								matchedCategory.value === category
						)
					) }
					options={ categoryOptions }
					onChange={ ( categorySelections ) => {
						handleChange(
							'categories',
							categorySelections.map(
								( category ) => category.value
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
