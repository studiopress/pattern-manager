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
import useSave from '../../hooks/useSave';
import { patternManager } from '../../globals';
import useEditedPostData from '../../hooks/useEditedPostData';

export default function PatternManagerMetaControls() {
	const { postMeta, title } = useEditedPostData();
	const [ patternNames, setPatternNames ] = useState(
		patternManager.patternNames.filter( ( name ) => {
			return name !== postMeta.name;
		} )
	);

	useSave( setPatternNames );

	const { postTypes, categories, blockTypes, updatePostMeta } =
		usePatternData( postMeta );

	return (
		<div>
			<TitlePanel
				postMeta={ postMeta }
				handleChange={ updatePostMeta }
				patternNames={ patternNames }
				title={ title }
			/>
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
