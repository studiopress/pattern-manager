import usePatterns from './hooks/usePatterns';
import versionControl from './hooks/useVersionControl';

export type PatternManagerViews = 'theme_patterns' | 'pattern_editor';

export type InitialContext = {
	patterns: ReturnType< typeof usePatterns >;
};

export type InitialPatternManager = {
	adminUrl: string;
	apiEndpoints: {
		deletePatternEndpoint: string;
		updateDismissedSitesEndpoint: string;
		updateDismissedThemesEndpoint: string;
	};
	apiNonce: string;
	previewNonce: string;
	patternCategories: QueriedCategories;
	patterns: Patterns;
	siteUrl: string;
	showEnvironmentNotice: boolean;
	showVersionControlNotice: boolean;
};

export type Pattern = {
	content: string;
	duplicateLink: string;
	editorLink: string;
	name: string;
	slug: string;
	title: string;
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
	patternCategories: InitialPatternManager[ 'patternCategories' ];
	PatternActions?: ( props: { patternData: Pattern } ) => JSX.Element;
	siteUrl: string;
	Notice?: JSX.Element;
};

export type QueriedCategories = {
	label: string;
	name: string;
}[];
