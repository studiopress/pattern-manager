/* eslint-disable no-undef, camelcase */

import React from 'react';
import useCurrentView from './hooks/useCurrentView';
import useCurrentId from './hooks/useCurrentId';
import useThemes from './hooks/useThemes';
import useThemeData from './hooks/useThemeData';
import usePatterns from './hooks/usePatterns';
import type { fsestudio } from './globals';

export type InitialContext = {
	currentView: ReturnType< typeof useCurrentView >;
	currentPatternId: ReturnType< typeof useCurrentId >;
	currentPattern: ReturnType< typeof useThemes >;
	themes: ReturnType< typeof useThemes >;
	currentThemeId: ReturnType< typeof useCurrentId >;
	currentTheme: ReturnType< typeof useThemeData >;
	currentStyleVariationId: ReturnType< typeof useCurrentId >;
	siteUrl: typeof fsestudio.siteUrl;
	apiEndpoints: typeof fsestudio.apiEndpoints;
	blockEditorSettings: typeof fsestudio.blockEditorSettings;
	patterns: ReturnType< typeof usePatterns >;
	patternEditorIframe: React.MutableRefObject<
		HTMLIFrameElement | undefined
	>;
	templateEditorIframe: React.MutableRefObject<
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
	schemas: {
		[ key: string ]: { [ key: string ]: { key: string; unknown } | [] };
	};
};

export type Pattern< T = void | string > = {
	type: 'pattern' | 'template' | 'template_part' | T;
	categories?: string[];
	content: string;
	name: string;
	title: string;
	slug?: string;
	viewportWidth?: string | number;
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
