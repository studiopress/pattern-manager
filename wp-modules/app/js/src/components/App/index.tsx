// Assets
import './index.scss';

// External dependencies
import loadable from '@loadable/component';

// WP dependencies
import { __ } from '@wordpress/i18n';
import {useState} from '@wordpress/element';

// Globals
import { patternManager } from '../../globals';

// Contexts
import PatternManagerContext from '../../contexts/PatternManagerContext';

// Hooks
import usePatterns from '../../hooks/usePatterns';
import useVersionControl from '../../hooks/useVersionControl';

// Components
import Header from '../Header';
import SiteNavigation from '../SiteNavigation';
import Patterns from '../Patterns';
const PatternGridActions: PatternGridActionsType = loadable(
	async () => import( '../Patterns/PatternGridActions' )
);
import VersionControlNotice from '../VersionControlNotice';

// Types
import type { SiteContext } from '../../types';
import { PatternGridActionsType } from '../Patterns/PatternGridActions';

export default function App() {
	const [currentTab, setCurrentTab] = useState(Object.keys( patternManager.sites )[0]);
	return <div>
		<Header />
		<div className="pattern-manager-body">
			<SiteNavigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
			{ Object.keys( patternManager.sites ).map( ( value, index ) => {
				return <SiteApp
					key={value}
					visible={currentTab === value }
					siteKey={value}
				/>
			})}
		</div>
	</div>
}

function SiteApp({siteKey, visible}) {

	const patterns = usePatterns( patternManager.sites[siteKey].patterns );
	const versionControl = useVersionControl(
		Boolean( patternManager.showVersionControlNotice )
	);

	const providerValue: SiteContext = {
		adminUrl:patternManager.sites[siteKey].localWpData.domain + '/wp-admin/',
		themePath:patternManager.sites[siteKey].themePath,
		patterns:patterns,
		patternCategories: patternManager.sites[siteKey].patternCategories,
		localWpData: patternManager.sites[siteKey].localWpData
	};

	return (
		<PatternManagerContext.Provider value={ providerValue }>
			<Patterns
				visible={visible}
				Notice={
					<VersionControlNotice
						isVisible={ versionControl.displayNotice }
						handleDismiss={ versionControl.updateDismissedThemes }
					/>
				}
				PatternActions={ PatternGridActions }
				patternCategories={ patternManager.sites[siteKey].patternCategories }
				patterns={ patterns.data }
				site={patternManager.sites[siteKey]}
				appUrl={patternManager.appUrl}
			/>
		</PatternManagerContext.Provider>
	);
}
