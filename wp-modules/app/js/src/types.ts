/* eslint-disable no-undef, camelcase */

export type InitialFseStudio = {
	apiNonce: string;
	apiEndpoints: {
		getAppState: string;
		getPatternEndpoint: string;
		getThemeEndpoint: string;
		getThemeJsonFileEndpoint: string;
		savePatternEndpoint: string;
		saveThemeEndpoint: string;
		switchThemeEndpoint: string;
		saveThemeJsonFileEndpoint: string;
		exportThemeEndpoint: string;
	};
	blockEditorSettings: Partial< {
		__unstableResolvedAssets?: { styles: string };
		styles?: { [ key: string ]: unknown }[];
	} >;
	initialTheme: string;
	patterns: { [ key: string ]: Pattern };
	siteUrl: string;
	adminUrl: string;
	themes: { [ key: string ]: Theme };
};

export type Pattern = {
	type: string;
	categories: string[];
	content: string;
	name: string;
	title: string;
	viewportWidth: number;
};

export type Theme = {
	id: string;
	name: string;
	namespace: string;
	'index.html'?: string;
	'404.html'?: string;
	'archive.html'?: string;
	'single.html'?: string;
	'page.html'?: string;
	'search.html'?: string;
	author: string;
	author_uri: string;
	description: string;
	dirname: string;
	included_patterns?: { [ key: string ]: Pattern };
	requires_php: string;
	requires_wp: string;
	rest_route?: string;
	styles: Object;
	tags: string;
	template_files: string[];
	template_parts: string[];
	tested_up_to: string;
	text_domain: string;
	theme_json_file: string[];
	uri: string;
	version: string;
};

export type Themes = {
	[ key: string ]: Theme
}
