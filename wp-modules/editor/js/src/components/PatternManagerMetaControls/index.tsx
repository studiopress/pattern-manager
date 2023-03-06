import { useState } from '@wordpress/element';
import { ModalToggle, InserterToggle } from '../Toggles';
import {
	TitlePanel,
	PostTypesPanel,
	CategoriesPanel,
	TransformsPanel,
	KeywordsPanel,
	DescriptionPanel,
	ViewportWidthPanel,
} from '../SidebarPanels';

import usePatternData from '../../hooks/usePatternData';
import useSave from '../../hooks/useSave';
import { patternManager } from '../../globals';
import useEditedPostData from '../../hooks/useEditedPostData';
import useSavedPostData from '../../hooks/useSavedPostData';

export default function PatternManagerMetaControls() {
	const { postMeta, title } = useEditedPostData();
	const { currentName } = useSavedPostData();
	const [ errorMessage, setErrorMessage ] = useState( '' );
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
				errorMessage={ errorMessage }
				setErrorMessage={ setErrorMessage }
				patternNames={ patternNames }
				title={ title }
				currentName={ currentName }
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
			<ViewportWidthPanel
				postMeta={ postMeta }
				handleChange={ updatePostMeta }
				errorMessage={ errorMessage }
				currentName={ currentName }
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
