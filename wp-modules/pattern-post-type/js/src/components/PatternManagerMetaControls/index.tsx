import { useState } from '@wordpress/element';
import { ModalToggle, InserterToggle } from '../Toggles';
import {
	TitlePanel,
	PostTypesPanel,
	CategoriesPanel,
	TransformsPanel,
	KeywordsPanel,
	DescriptionPanel,
	TemplateDetails,
} from '../SidebarPanels';

import usePatternData from '../../hooks/usePatternData';
import useSetup from '../../hooks/useSetup';
import useSaveButtonInterrupter from '../../hooks/useSaveButtonInterrupter';
import useFilters from '../../hooks/useFilters';
import { patternManager } from '../../globals';
import { Patterns } from '../../types';
import usePostData from '../../hooks/usePostData';

export default function PatternManagerMetaControls() {
	const { postContent, postMeta } = usePostData();
	const [ patternName, setPatternName ] = useState(
		new URL( location.href ).searchParams.get( 'name' )
	);
	const [ patterns, setPatterns ] = useState( patternManager.patterns );
	const pattern = patterns?.[ patternName ];
	function updatePatterns( newPatterns: Patterns ) {
		setPatterns( {
			...patterns,
			...newPatterns,
		} );
	}

	useSetup( patternName, pattern, updatePatterns, postContent, postMeta );
	useSaveButtonInterrupter( patterns, updatePatterns );
	useFilters( postMeta );

	const { postTypes, categories, blockTypes, updatePostMeta } =
		usePatternData( postMeta );

	return (
		<div>
			<TitlePanel
				postMeta={ postMeta }
				handleChange={ updatePostMeta }
				patternName={ patternName }
				patterns={ patterns }
				setPatternName={ setPatternName }
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
