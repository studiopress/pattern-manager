import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Spinner } from '@wordpress/components';

import Creatable from 'react-select/creatable';

import convertToSlug from '../../utils/convertToSlug';
import getSelectedOptions from '../../utils/getSelectedOptions';
import getCustomCategories from '../../utils/getCustomCategories';
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
					value={ getSelectedOptions(
						categories,
						categoryOptions,
						'value'
					) }
					options={ categoryOptions }
					onChange={ ( categorySelections ) => {
						const selections = categorySelections.map(
							( category ) => category.value
						);

						handleChange( 'categories', selections, {
							customCategories: getCustomCategories(
								selections,
								categoryOptions
							),
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
