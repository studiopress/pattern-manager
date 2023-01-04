import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Spinner } from '@wordpress/components';
import Select from 'react-select';

import type { BaseSidebarProps, AdditionalSidebarProps } from '../types';

/**
 * The panel section for assigning block pattern categories to the pattern.
 * Selected categories will show under the matching dropdown in the site editor.
 */
export default function CategoriesPanel( {
	postMeta,
	categories,
	handleChange,
}: BaseSidebarProps & Pick< AdditionalSidebarProps, 'categories' > ) {
	return (
		<PluginDocumentSettingPanel
			name="fsestudio-pattern-editor-pattern-categories"
			title={ __( 'Pattern Categories', 'fse-studio' ) }
		>
			{ categories ? (
				<Select
					isMulti
					isClearable
					closeMenuOnSelect={ false }
					value={ postMeta?.categories?.map( ( category ) =>
						categories.find(
							( matchedCategory ) =>
								matchedCategory.value === category
						)
					) }
					options={ categories }
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
