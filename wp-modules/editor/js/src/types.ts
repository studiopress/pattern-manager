/* eslint-disable camelcase */

export type PostMeta = {
	name: string;
	description: string;
	postTypes: string[];
	blockTypes: string[];
	categories: string[];
	keywords: string[];
	inserter: boolean;
	viewportWidth: number;
};

export type SelectQuery = ( dataStore: string ) => {
	getEditedPostAttribute: ( postAttribute: string ) => unknown;
	getEditedPostContent: () => string;
	isEditedPostDirty: () => boolean;
	getPostTypes: ( {
		per_page,
	}: {
		per_page?: number | string;
	} ) => { name: string; slug: string }[];
	getBlockPatternCategories: () => { name: string; label: string }[];
	getBlockTypes: () => { name: string; transforms?: unknown }[];
	getNotices: () => { id: string }[];
	isSavingPost: () => boolean;
	getCurrentPostAttribute: ( attributeName: 'meta' ) => PostMeta;
};

export type Pattern = {
	content: string;
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

export type InitialPatternManager = {
	activeTheme: string;
	apiNonce: string;
	apiEndpoints: {
		getPatternNamesEndpoint: string;
	};
	patternNames: Array< Pattern[ 'slug' ] >;
	siteUrl: string;
};
