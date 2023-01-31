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
import { Patterns } from '../../types';
import usePostData from '../../hooks/usePostData';
import convertToSlug from '../../utils/convertToSlug';

export default function PatternManagerMetaControls() {
	const { postContent, postMeta } = usePostData();
	const patternName = decodeURIComponent(
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

	const { postTypes, categories, blockTypes, updatePostMeta } =
		usePatternData( postMeta );

	return (
		<div>
			<TitlePanel
				postMeta={ postMeta }
				handleChange={ updatePostMeta }
				patterns={ patterns }
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
