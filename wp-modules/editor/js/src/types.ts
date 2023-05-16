/* eslint-disable camelcase */

export type PostMeta = {
	blockTypes: string[];
	categories: string[];
	description: string;
	inserter: boolean;
	keywords: string[];
	name: string;
	postTypes: string[];
	viewportWidth: number;
};

export type PatternPostData = PostMeta & {
	title: string;
};

export type SelectQuery = ( dataStore: string ) => {
	getBlockPatternCategories: () => { name: string; label: string }[];
	getBlockTypes: () => { name: string; transforms?: unknown }[];
	getCurrentPostAttribute: ( attributeName: 'meta' ) => PostMeta;
	getEditedPostAttribute: ( postAttribute: string ) => unknown;
	getEditedPostContent: () => string;
	getNotices: () => { id: string }[];
	getPostTypes: ( {
		per_page,
	}: {
		per_page?: number | string;
	} ) => { name: string; slug: string }[];
	isEditedPostDirty: () => boolean;
	isSavingPost: () => boolean;
};

export type Pattern = {
	blockTypes: string[];
	categories: string[];
	editorLink: string;
	content: string;
	description: string;
	inserter: boolean;
	keywords: string[];
	name: string;
	postTypes: string[];
	slug: string;
	title: string;
	viewportWidth: number;
};

export type Patterns = {
	[ key: string ]: Pattern;
};

export type InitialPatternManager = {
	activeTheme: string;
	apiNonce: string;
	apiEndpoints: {
		getPatternFileNamesEndpoint: string;
	};
	patternCategories: {
		label: string;
		name: string;
	}[];
	patternFileNames: Array< Pattern[ 'slug' ] >;
	patterns: Record< Pattern[ 'slug' ], Pattern >;
	siteUrl: string;
};

export type Block = {
	attributes: Record< string, unknown >;
	innerBlocks?: Block[];
	name: string;
};
