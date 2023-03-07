import { useState } from '@wordpress/element';
import { InserterToggle, ModalToggle } from '../Toggles';
import {
	CategoriesPanel,
	DescriptionPanel,
	KeywordsPanel,
	PostTypesPanel,
	TitlePanel,
	TransformsPanel,
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

	const {
		queriedBlockTypes,
		queriedCategories,
		queriedPostTypes,
		updatePostMeta,
		updatePostMetaMulti,
	} = usePatternData( postMeta );

	return (
		<div>
			<TitlePanel
				currentName={ currentName }
				errorMessage={ errorMessage }
				patternNames={ patternNames }
				title={ title }
				handleChange={ updatePostMeta }
				setErrorMessage={ setErrorMessage }
			/>
			<CategoriesPanel
				categories={ postMeta.categories }
				categoryOptions={ queriedCategories }
				handleChange={ updatePostMeta }
			/>
			<KeywordsPanel
				keywords={ postMeta.keywords }
				handleChange={ updatePostMeta }
			/>
			<DescriptionPanel
				description={ postMeta.description }
				handleChange={ updatePostMeta }
			/>
			<ViewportWidthPanel
				currentName={ currentName }
				errorMessage={ errorMessage }
				viewportWidth={ postMeta.viewportWidth }
				handleChange={ updatePostMeta }
			/>
			<PostTypesPanel
				blockTypes={ postMeta.blockTypes }
				postTypeOptions={ queriedPostTypes }
				postTypes={ postMeta.postTypes }
				handleChange={ updatePostMeta }
			>
				<ModalToggle
					blockTypes={ postMeta.blockTypes }
					inserter={ postMeta.inserter }
					postTypes={ postMeta.postTypes }
					handleChangeMulti={ updatePostMetaMulti }
				/>
				<InserterToggle
					inserter={ postMeta.inserter }
					postTypes={ postMeta.postTypes }
					handleChange={ updatePostMeta }
				/>
			</PostTypesPanel>
			<TransformsPanel
				blockTypeOptions={ queriedBlockTypes }
				blockTypes={ postMeta.blockTypes }
				handleChange={ updatePostMeta }
			/>
		</div>
	);
}
