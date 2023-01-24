//  Assets
import '../../../../css/src/index.scss';

// WP dependencies
import { useRef } from '@wordpress/element';
import { Snackbar } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Globals
import { patternManager } from '../../globals';

// Contexts
import PatternManagerContext from '../../contexts/PatternManagerContext';

// Hooks
import useCurrentId from '../../hooks/useCurrentId';
import useCurrentView from '../../hooks/useCurrentView';
import usePatterns from '../../hooks/usePatterns';
import usePmContext from '../../hooks/usePmContext';
import useNotice from '../../hooks/useNotice';

// Components
import Patterns from '../Patterns';
import PatternsNav from '../PatternsNav';
import PatternEditor from '../PatternEditor';

// Types
import type { InitialContext } from '../../types';

export default function App() {
	const currentPatternId = useCurrentId( '' );
	const notice = useNotice();
	const patterns = usePatterns( patternManager.patterns, notice );

	const providerValue: InitialContext = {
		notice,
		patterns,
		currentPatternId,
		currentView: useCurrentView( 'theme_patterns' ),
		currentPattern: patterns.data?.[ currentPatternId.value ],
		siteUrl: patternManager.siteUrl,
		apiEndpoints: patternManager.apiEndpoints,
		patternEditorIframe: useRef< HTMLIFrameElement >(),
		templateEditorIframe: useRef< HTMLIFrameElement >(),
	};

	return (
		<PatternManagerContext.Provider value={ providerValue }>
			<PatternManager />
		</PatternManagerContext.Provider>
	);
}

function PatternManager() {
	const { currentView, notice } = usePmContext();

	return (
		<>
			{ notice.snackBarValue ? (
				<Snackbar
					onRemove={ () => {
						notice.setSnackBarValue( null );
					} }
				>
					{ notice.snackBarValue }
				</Snackbar>
			) : null }
			{ 'theme_patterns' === currentView.currentView ? (
				<>
					<PatternsNav />
					<Patterns />
				</>
			) : null }
			{ 'pattern_editor' === currentView.currentView ? (
				<PatternEditor />
			) : null }
		</>
	);
}
