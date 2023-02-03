//  Assets
import '../../../../css/src/index.scss';

// WP dependencies
import { Snackbar } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Globals
import { patternManager } from '../../globals';

// Contexts
import PatternManagerContext from '../../contexts/PatternManagerContext';

// Hooks
import useNotice from '../../hooks/useNotice';
import usePatterns from '../../hooks/usePatterns';

// Components
import Header from '../Header';
import Patterns from '../Patterns';

// Types
import type { InitialContext } from '../../types';

export default function App() {
	const notice = useNotice();
	const patterns = usePatterns( patternManager.patterns );

	const providerValue: InitialContext = {
		apiEndpoints: patternManager.apiEndpoints,
		notice,
		patterns,
		siteUrl: patternManager.siteUrl,
	};

	return (
		<PatternManagerContext.Provider value={ providerValue }>
			{ notice.value ? (
				<Snackbar
					onRemove={ () => {
						notice.set( null );
					} }
				>
					{ notice.value }
				</Snackbar>
			) : null }
			<Header />
			<Patterns />
		</PatternManagerContext.Provider>
	);
}
