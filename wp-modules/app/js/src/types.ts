import usePatterns from './hooks/usePatterns';

export type PatternManagerViews = 'theme_patterns' | 'pattern_editor';

export type InitialContext = {
	apiEndpoints: InitialPatternManager[ 'apiEndpoints' ];
	patterns: ReturnType< typeof usePatterns >;
	siteUrl: InitialPatternManager[ 'siteUrl' ];
};

export type InitialPatternManager = {
	apiEndpoints: {
		deletePatternEndpoint: string;
	};
	apiNonce: string;
	siteUrl: string;
	adminUrl: string;
	patterns: Patterns;
};

export type Pattern = {
	content: string;
	editorLink: string;
	name: string;
	title: string;
	slug: string;
	description?: string;
	categories?: string[];
	keywords?: string[];
	blockTypes?: string[];
	postTypes?: string[];
	inserter?: boolean;
	viewportWidth?: number;
};

export type Patterns = {
	[ key: string ]: Pattern;
};
