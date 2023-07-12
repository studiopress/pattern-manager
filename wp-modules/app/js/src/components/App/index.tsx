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
import useEnvironment from '../../hooks/useEnvironment';
import usePatterns from '../../hooks/usePatterns';
import useVersionControl from '../../hooks/useVersionControl';

// Components
import Header from '../Header';
import Patterns from '../Patterns';
const PatternGridActions: PatternGridActionsType = loadable(
	async () => import( '../Patterns/PatternGridActions' )
);
import EnvironmentNotice from '../EnvironmentNotice';
import VersionControlNotice from '../VersionControlNotice';

// Types
import type { InitialContext } from '../../types';
import { PatternGridActionsType } from '../Patterns/PatternGridActions';

export default function App() {
	const patterns = usePatterns( patternManager.patterns );
	const environment = useEnvironment(
		Boolean( patternManager.showEnvironmentNotice )
	);
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
					<div className="patternmanager-notice-container">
						<VersionControlNotice
							isVisible={ versionControl.displayNotice }
							handleDismiss={
								versionControl.updateDismissedThemes
							}
						/>
						<EnvironmentNotice
							isVisible={ environment.displayNotice }
							handleDismiss={ environment.updateDismissedSites }
						/>
					</div>
				}
				PatternActions={ PatternGridActions }
				patternCategories={ patternManager.patternCategories }
				patterns={ patterns.data }
				siteUrl={ patternManager.siteUrl }
			/>
		</PatternManagerContext.Provider>
	);
}
