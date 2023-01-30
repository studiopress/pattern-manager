import { useState } from '@wordpress/element';
import PatternEditorSidebar from '../PatternEditorSidebar';
import usePostData from '../../hooks/usePostData';
import useSetup from '../../hooks/useSetup';
import useSaveButtonInterrupter from '../../hooks/useSaveButtonInterrupter';
import useFilters from '../../hooks/useFilters';
import { patternManager } from '../../globals';
import { Patterns } from '../../types';

export default function PatternManagerMetaControls() {
	const { coreLastUpdate, postMeta } = usePostData();
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

	useSetup( patternName, pattern, updatePatterns );
	useSaveButtonInterrupter();
	useFilters( postMeta );

	return (
		<PatternEditorSidebar
			coreLastUpdate={ coreLastUpdate }
			postMeta={ postMeta }
			patternName={ patternName }
			setPatternName={ setPatternName }
		/>
	);
}
