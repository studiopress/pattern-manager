//  Assets
import '../../../../css/src/index.scss';

// WP dependencies
import { __ } from '@wordpress/i18n';

// Globals
import { patternManager } from '../../globals';

// Contexts
import PatternManagerContext from '../../contexts/PatternManagerContext';

// Hooks
import usePatterns from '../../hooks/usePatterns';
import useVersionControl from '../../hooks/useVersionControl';

// Components
import Header from '../Header';
import Patterns from '../Patterns';

// Types
import type { InitialContext } from '../../types';

export default function App() {
	const patterns = usePatterns( patternManager.patterns );
	const versionControl = useVersionControl( patternManager.dismissedThemes );

	const providerValue: InitialContext = {
		apiEndpoints: patternManager.apiEndpoints,
		patternCategories: patternManager.patternCategories,
		patterns,
		siteUrl: patternManager.siteUrl,
		versionControl,
	};

	return (
		<PatternManagerContext.Provider value={ providerValue }>
			<Header />
			<Patterns />
		</PatternManagerContext.Provider>
	);
}
