import usePatterns from './hooks/usePatterns';
import versionControl from './hooks/useVersionControl';

export type PatternManagerViews = 'theme_patterns' | 'pattern_editor';

export type SiteContext = {
	adminUrl: string;
	patternCategories: QueriedCategories;
	patterns: ReturnType< typeof usePatterns >;
	siteUrl: string;
	localWpData: {
		name: string;
		path: string;
		domain: string;
		id: string;
		localVersion: string;
	};
};
export type Site = {
	adminUrl: string;
	patternCategories: QueriedCategories;
	patterns: Patterns;
	siteUrl: string;
	localWpData: {
		name: string;
		path: string;
		domain: string;
		id: string;
		localVersion: string;
	};
};

export type InitialPatternManager = {
	appUrl: string;
	apiEndpoints: {
		deletePatternEndpoint: string;
		updateDismissedThemesEndpoint: string;
	};
	apiNonce: string;
	showVersionControlNotice: boolean;
	sites: { [ key: string ]: Site };
};

export type Pattern = {
	content: string;
	editorLink: string;
	name: string;
	slug: string;
	title: string;
	path: string;
	blockTypes?: string[];
	categories?: string[];
	description?: string;
	inserter?: boolean;
	keywords?: string[];
	postTypes?: string[];
	viewportWidth?: number;
};

export type Patterns = {
	[ key: string ]: Pattern;
};

export type PatternsProps = {
	patterns: Patterns;
	onSelectPattern?: ( pattern: Pattern ) => void;
	patternCategories: Site[ 'patternCategories' ];
	PatternActions?: ( props: { patternData: Pattern } ) => JSX.Element;
	siteUrl: string;
	Notice?: JSX.Element;
	visible: boolean;
};

export type QueriedCategories = {
	label: string;
	name: string;
}[];

export type Theme = {
	name: string;
};
