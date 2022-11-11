/* eslint-disable no-undef, camelcase */

import type { fsestudio } from './globals';

export type InitialContext = {
	currentView: ReturnType< typeof import('./hooks/useCurrentView').default >;
	currentPatternId: ReturnType<
		typeof import('./hooks/useCurrentId').default
	>;
	currentPattern: ReturnType< typeof import('./hooks/useThemes').default >;
	themes: ReturnType< typeof import('./hooks/useThemes').default >;
	currentThemeId: ReturnType< typeof import('./hooks/useCurrentId').default >;
	currentTheme: ReturnType< typeof import('./hooks/useThemeData').default >;
	currentStyleVariationId: ReturnType<
		typeof import('./hooks/useCurrentId').default
	>;
	siteUrl: typeof fsestudio.siteUrl;
	apiEndpoints: typeof fsestudio.apiEndpoints;
	blockEditorSettings: typeof fsestudio.blockEditorSettings;
	patterns: ReturnType< typeof import('./hooks/usePatterns').default >;
	patternEditorIframe: import('react').MutableRefObject<
		HTMLIFrameElement | undefined
	>;
	templateEditorIframe: import('react').MutableRefObject<
		HTMLIFrameElement | undefined
	>;
};

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
	type: 'pattern' | 'template' | 'template_part';
	categories: string[];
	content: string;
	name: string;
	title: string;
	viewportWidth: number;
};

export type Patterns = {
	[ key: string ]: Pattern;
};

export type Style = {
	id: string;
	title: string;
	body: { [ key: string ]: unknown };
};

export type Styles = {
	[ key: string ]: Style;
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
	styles: { [ key: string ]: Style };
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
	[ key: string ]: Theme;
};
