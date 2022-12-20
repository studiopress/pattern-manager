import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow } from '@wordpress/components';
import { ModalToggle, InserterToggle } from '../Toggles';
import {
	TitlePanel,
	PostTypesPanel,
	CategoriesPanel,
	TransformsPanel,
	KeywordsPanel,
	DescriptionPanel,
} from './SidebarPanels';

import usePatternData from '../../hooks/usePatternData';

export default function PatternEditorSidebar( { coreLastUpdate, postMeta } ) {
	const {
		postTypes,
		blockPatternCategories,
		transformableBlockTypes,
		updatePostMeta,
	} = usePatternData( postMeta );

	/**
	 * Handler for ToggleControl component changes.
	 * Intended to target postMeta values in an array.
	 *
	 * @param {boolean} event The toggle event.
	 * @param {string}  key   The object key to reference in postMeta.
	 * @param {string}  value The value to update or remove from postMeta.
	 */
	function handleToggleChangeMulti( event, key, value ) {
		let updatedValues = [];

		if ( event ) {
			updatedValues = ! postMeta[ key ]?.includes( value )
				? postMeta[ key ]?.concat( [ value ] )
				: postMeta[ key ];
		} else {
			updatedValues = postMeta[ key ]?.includes( value )
				? postMeta[ key ]?.filter( ( item ) => {
						return item !== value;
				  } )
				: postMeta[ key ];
		}

		updatePostMeta( key, updatedValues );
	}

	if ( postMeta?.type === 'template' ) {
		return (
			<div id={ coreLastUpdate }>
				<PluginDocumentSettingPanel
					className="fsestudio-template-details"
					title={ __( 'Template Details', 'fse-studio' ) }
					icon="edit"
				>
					<PanelRow>
						{ __( 'Template:', 'fse-studio' ) +
							' ' +
							postMeta.title }
					</PanelRow>
				</PluginDocumentSettingPanel>
			</div>
		);
	}

	return (
		<div id={ coreLastUpdate }>
			<TitlePanel postMeta={ postMeta } handleChange={ updatePostMeta } />

			<CategoriesPanel
				postMeta={ postMeta }
				categories={ blockPatternCategories }
				handleChange={ updatePostMeta }
			/>

			<PostTypesPanel
				postMeta={ postMeta }
				postTypes={ postTypes }
				handleChange={ updatePostMeta }
			>
				<ModalToggle
					postMeta={ postMeta }
					handleChange={ handleToggleChangeMulti }
				/>
				<InserterToggle
					postMeta={ postMeta }
					handleChange={ updatePostMeta }
				/>
			</PostTypesPanel>

			<TransformsPanel
				postMeta={ postMeta }
				blockTypes={ transformableBlockTypes }
				handleChange={ updatePostMeta }
			/>

			<KeywordsPanel
				postMeta={ postMeta }
				handleChange={ updatePostMeta }
			/>

			<DescriptionPanel
				postMeta={ postMeta }
				handleChange={ updatePostMeta }
			/>
		</div>
	);
}
