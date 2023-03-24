import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Spinner } from '@wordpress/components';
import Creatable from 'react-select/creatable';
import convertToSlug from '../../utils/convertToSlug';

import type { BaseSidebarProps, AdditionalSidebarProps } from './types';

/**
 * The panel section for assigning block pattern categories to the pattern.
 * Selected categories will show under the matching dropdown in the site editor.
 */
export default function CategoriesPanel( {
	categories,
	categoryOptions,
	customCategories,
	handleChange,
}: BaseSidebarProps< 'categories' | 'customCategories' > &
	AdditionalSidebarProps< 'categoryOptions' > ) {
	// The list of currently selected categories, formatted for react-select.
	const selectedCategories: typeof categoryOptions = categories.reduce(
		( acc, categoryName ) =>
			! acc.includes( categoryName )
				? [
						...acc,
						categoryOptions.find(
							( matchedCategory ) =>
								matchedCategory.value === categoryName
						),
				  ]
				: acc,
		[]
	);

	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-categories"
			title={ __( 'Pattern Categories', 'pattern-manager' ) }
		>
			{ categoryOptions ? (
				<Creatable
					isMulti
					isClearable
					closeMenuOnSelect={ false }
					aria-label={ __(
						'Add Pattern Categories',
						'pattern-manager'
					) }
					value={ selectedCategories }
					options={ categoryOptions }
					onChange={ ( categorySelections ) => {
						const selections = categorySelections.map(
							( category ) => category.value
						);

						const customCategorySelections = categoryOptions.reduce(
							( acc, category ) => {
								const customCategoryFound =
									selections.includes( category.value ) &&
									/^pm_custom_category_/.test(
										category.value
									);

								return customCategoryFound
									? [ ...acc, category.label ]
									: acc;
							},
							[]
						);

						handleChange( 'categories', selections, {
							customCategories: customCategorySelections,
						} );
					} }
					onCreateOption={ ( newCategoryTitle ) => {
						handleChange(
							'customCategories',
							[ ...customCategories, newCategoryTitle ],
							{
								categories: [
									...categories,
									`pm_custom_category_${ convertToSlug(
										newCategoryTitle
									) }`,
								],
							}
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
