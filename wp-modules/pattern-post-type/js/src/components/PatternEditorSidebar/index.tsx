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
import type { PatternEditorSidebarProps } from '../PatternEditorSidebar/types';

export default function PatternEditorSidebar( {
	coreLastUpdate,
	postMeta,
}: PatternEditorSidebarProps ) {
	const {
		filteredPostTypes,
		templatePartBlockTypeSelected,
		postTypes,
		categories,
		blockTypes,
		updatePostMeta,
	} = usePatternData( postMeta );

	return (
		<div id={ coreLastUpdate }>
			{ postMeta?.type === 'template' ? (
				<TemplateDetails postMeta={ postMeta } />
			) : (
				<>
					<TitlePanel
						postMeta={ postMeta }
						handleChange={ updatePostMeta }
					/>
					<CategoriesPanel
						postMeta={ postMeta }
						categories={ categories }
						handleChange={ updatePostMeta }
					/>
					<PostTypesPanel
						postTypes={ postTypes }
						handleChange={ updatePostMeta }
						filteredPostTypes={ filteredPostTypes }
						templatePartBlockTypeSelected={
							templatePartBlockTypeSelected
						}
					>
						<ModalToggle
							postMeta={ postMeta }
							handleChange={ updatePostMeta }
						/>
						<InserterToggle
							postMeta={ postMeta }
							handleChange={ updatePostMeta }
						/>
					</PostTypesPanel>
					<TransformsPanel
						postMeta={ postMeta }
						blockTypes={ blockTypes }
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
				</>
			) }
		</div>
	);
}
