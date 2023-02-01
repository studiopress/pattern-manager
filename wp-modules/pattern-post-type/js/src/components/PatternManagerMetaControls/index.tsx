import { useState } from '@wordpress/element';
import { ModalToggle, InserterToggle } from '../Toggles';
import {
	TitlePanel,
	PostTypesPanel,
	CategoriesPanel,
	TransformsPanel,
	KeywordsPanel,
	DescriptionPanel,
} from '../SidebarPanels';

import usePatternData from '../../hooks/usePatternData';
import useSetup from '../../hooks/useSetup';
import useSaveButtonInterrupter from '../../hooks/useSaveButtonInterrupter';
import { patternManager } from '../../globals';
import usePostData from '../../hooks/usePostData';

export default function PatternManagerMetaControls() {
	const { postContent, postMeta } = usePostData();

	useSetup( patternManager.pattern );

	const { postTypes, categories, blockTypes, updatePostMeta } =
		usePatternData( postMeta );
	useSaveButtonInterrupter( postContent, postMeta, updatePostMeta );

	return (
		<div>
			<TitlePanel postMeta={ postMeta } handleChange={ updatePostMeta } />
			<CategoriesPanel
				postMeta={ postMeta }
				categories={ categories }
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
			<PostTypesPanel
				postMeta={ postMeta }
				postTypes={ postTypes }
				handleChange={ updatePostMeta }
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
		</div>
	);
}
