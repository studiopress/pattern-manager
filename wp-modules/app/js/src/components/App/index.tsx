// Assets
import './index.scss';

// External dependencies
import loadable from '@loadable/component';

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
const PatternGridActions: PatternGridActionsType = loadable(
	async () => import( '../Patterns/PatternGridActions' )
);
import VersionControlNotice from '../VersionControlNotice';

// Types
import type { InitialContext } from '../../types';
import { PatternGridActionsType } from '../Patterns/PatternGridActions';

export default function App() {
	const patterns = usePatterns( patternManager.patterns );
	const versionControl = useVersionControl(
		Boolean( patternManager.showVersionControlNotice )
	);

	const providerValue: InitialContext = {
		patterns,
	};

	return (
		<PatternManagerContext.Provider value={ providerValue }>
			<Header />
			<Patterns
				Notice={
					<VersionControlNotice
						isVisible={ versionControl.displayNotice }
						handleDismiss={ versionControl.updateDismissedThemes }
					/>
				}
				PatternActions={ PatternGridActions }
				patternCategories={ patternManager.patternCategories }
				patterns={ patterns.data }
				siteUrl={ patternManager.siteUrl }
			/>
		</PatternManagerContext.Provider>
	);
}
