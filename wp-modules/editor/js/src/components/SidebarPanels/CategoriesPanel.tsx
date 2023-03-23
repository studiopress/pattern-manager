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
	const combinedSelectedCategories = [
		...customCategories.filter( ( categoryTitle ) =>
			categories.includes( convertToSlug( categoryTitle ) )
		),
		...categories,
	];

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
					value={ combinedSelectedCategories.reduce(
						( acc, categoryName ) =>
							! acc.includes( categoryName )
								? [
										...acc,
										categoryOptions.find(
											( matchedCategory ) =>
												matchedCategory.value ===
												categoryName
										),
								  ]
								: acc,
						[]
					) }
					options={ categoryOptions }
					onChange={ ( categorySelections ) => {
						const selections = categorySelections.map(
							( category ) => category.value
						);

						const customCategorySelections = categoryOptions.reduce(
							( acc, category ) => {
								const customCategoryFound =
									selections.includes( category.value ) &&
									category.pm_meta &&
									category.pm_meta === 'pm_custom_category';

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
									convertToSlug( newCategoryTitle ),
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
