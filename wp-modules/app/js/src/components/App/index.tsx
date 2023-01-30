//  Assets
import '../../../../css/src/index.scss';

// WP dependencies
import { useRef } from '@wordpress/element';
import { Snackbar, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Globals
import { patternManager } from '../../globals';

// Contexts
import PatternManagerContext from '../../contexts/PatternManagerContext';

// Hooks
import usePatterns from '../../hooks/usePatterns';
import usePmContext from '../../hooks/usePmContext';
import useNotice from '../../hooks/useNotice';

// Components
import Header from '../Header';
import Patterns from '../Patterns';

// Types
import type { InitialContext } from '../../types';

export default function App() {
	const notice = useNotice();
	const patterns = usePatterns( patternManager.patterns, notice );

	const providerValue: InitialContext = {
		notice,
		patterns,
		siteUrl: patternManager.siteUrl,
		apiEndpoints: patternManager.apiEndpoints,
	};

	return (
		<PatternManagerContext.Provider value={ providerValue }>
			<PatternManager />
		</PatternManagerContext.Provider>
	);
}

function PatternManager() {
	const { notice } = usePmContext();

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
			<Header />
			<Patterns />
		</>
	);
}
