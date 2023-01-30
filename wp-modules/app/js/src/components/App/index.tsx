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

// Components
import Header from '../Header';
import Patterns from '../Patterns';

// Types
import type { InitialContext } from '../../types';

export default function App() {
	const patterns = usePatterns( patternManager.patterns );

	const providerValue: InitialContext = {
		patterns,
		siteUrl: patternManager.siteUrl,
		apiEndpoints: patternManager.apiEndpoints,
	};

	return (
		<PatternManagerContext.Provider value={ providerValue }>
			<Header />
			<Patterns />
		</PatternManagerContext.Provider>
	);
}
