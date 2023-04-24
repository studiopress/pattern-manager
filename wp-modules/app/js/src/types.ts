import usePatterns from './hooks/usePatterns';

export type PatternManagerViews = 'theme_patterns' | 'pattern_editor';

export type InitialContext = {
	patterns: ReturnType< typeof usePatterns >;
};

export type InitialPatternManager = {
	adminUrl: string;
	apiEndpoints: {
		deletePatternEndpoint: string;
	};
	apiNonce: string;
	patternCategories: QueriedCategories;
	patterns: Patterns;
	siteUrl: string;
};

export type Pattern = {
	content: string;
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
};

export type QueriedCategories = {
	label: string;
	name: string;
}[];
