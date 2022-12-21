import { __ } from '@wordpress/i18n';
import { ModalToggle, InserterToggle } from '../Toggles';
import {
	TitlePanel,
	PostTypesPanel,
	CategoriesPanel,
	TransformsPanel,
	KeywordsPanel,
	DescriptionPanel,
	TemplateDetails,
} from './SidebarPanels';

import usePatternData from '../../hooks/usePatternData';

export default function PatternEditorSidebar( { coreLastUpdate, postMeta } ) {
	const {
		postTypes,
		blockPatternCategories,
		transformableBlockTypes,
		updatePostMeta,
	} = usePatternData( postMeta );

	const panelProps = {
		postMeta,
		postTypes,
		categories: blockPatternCategories,
		blockTypes: transformableBlockTypes,
		handleChange: updatePostMeta,
	};

	return (
		<div id={ coreLastUpdate }>
			{ postMeta?.type === 'template' ? (
				<TemplateDetails { ...panelProps } />
			) : (
				<>
					<TitlePanel { ...panelProps } />
					<CategoriesPanel { ...panelProps } />
					<PostTypesPanel { ...panelProps }>
						<ModalToggle { ...panelProps } />
						<InserterToggle { ...panelProps } />
					</PostTypesPanel>
					<TransformsPanel { ...panelProps } />
					<KeywordsPanel { ...panelProps } />
					<DescriptionPanel { ...panelProps } />
				</>
			) }
		</div>
	);
}
