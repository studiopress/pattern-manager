import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Spinner } from '@wordpress/components';

import Creatable from 'react-select/creatable';

import toKebabCase from '../../utils/toKebabCase';
import getSelectedOptions from '../../utils/getSelectedOptions';
import getCustomCategories from '../../utils/getCustomCategories';
import { hasIllegalChars, stripIllegalChars } from '../../utils/validateInput';
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
	const [ categoryTitleIsInvalid, setCategoryTitleIsInvalid ] =
		useState( false );

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
						const validatedTitle =
							stripIllegalChars( newCategoryTitle );

						handleChange(
							'customCategories',
							[ ...customCategories, validatedTitle ],
							{
								categories: [
									...categories,
									toKebabCase( validatedTitle ),
								],
							}
						);
					} }
					onInputChange={ ( event ) => {
						setCategoryTitleIsInvalid( hasIllegalChars( event ) );
					} }
					formatCreateLabel={ ( userInput ) =>
						`Create "${ stripIllegalChars( userInput ) }"`
					}
					menuPlacement="auto"
					styles={ {
						menu: ( base ) => ( {
							...base,
							zIndex: 100,
						} ),
						control: ( baseStyles ) => ( {
							...baseStyles,
							borderColor: categoryTitleIsInvalid
								? 'red !important'
								: baseStyles.borderColor,
							boxShadow: categoryTitleIsInvalid
								? '0 0 0 1px red'
								: baseStyles.boxShadow,
						} ),
					} }
				/>
			) : (
				<Spinner />
			) }
		</PluginDocumentSettingPanel>
	);
}
