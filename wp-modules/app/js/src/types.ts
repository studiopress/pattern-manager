import usePatterns from './hooks/usePatterns';

export type PatternManagerViews = 'theme_patterns' | 'pattern_editor';

export type InitialContext = {
	apiEndpoints: InitialPatternManager[ 'apiEndpoints' ];
	patternCategories: InitialPatternManager[ 'patternCategories' ];
	patterns: ReturnType< typeof usePatterns >;
	siteUrl: InitialPatternManager[ 'siteUrl' ];
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
	onSelectPattern?: ( patternName: Pattern[ 'name' ] ) => void;
	PatternActions?: ( props: { patternData: Pattern } ) => JSX.Element;
};

export type QueriedCategories = {
	label: string;
	name: string;
}[];
