/* eslint-disable camelcase */

import React from 'react';
import useNotice from './hooks/useNotice';
import useCurrentView from './hooks/useCurrentView';
import useCurrentId from './hooks/useCurrentId';
import useCurrentTheme from './hooks/useThemeData';
import usePatterns from './hooks/usePatterns';
import { PatternType } from './enums';

export type PatternManagerViews = 'theme_patterns' | 'pattern_editor';

export type NoticeContext = ReturnType< typeof useNotice >;

export type InitialContext = {
	currentTheme: ReturnType< typeof useCurrentTheme >;
	currentView: ReturnType< typeof useCurrentView >;
	currentPatternId: ReturnType< typeof useCurrentId >;
	currentPattern: Pattern;
	siteUrl: InitialPatternManager[ 'siteUrl' ];
	apiEndpoints: InitialPatternManager[ 'apiEndpoints' ];
	patterns: ReturnType< typeof usePatterns >;
	patternEditorIframe: React.MutableRefObject<
		HTMLIFrameElement | undefined
	>;
	templateEditorIframe: React.MutableRefObject<
		HTMLIFrameElement | undefined
	>;
};

export type InitialPatternManager = {
	apiNonce: string;
	apiEndpoints: {
		getThemeEndpoint: string;
		saveThemeEndpoint: string;
	};
	siteUrl: string;
	adminUrl: string;
	theme: Theme;
};

export type Pattern = {
	type: PatternType;
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
	viewportWidth?: string | number;
};

export type Patterns = {
	[ key: string ]: Pattern;
};

export type Theme = {
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
	included_patterns?: Patterns;
	requires_php: string;
	requires_wp: string;
	rest_route?: string;
	tags: string;
	template_files?: string[];
	template_parts?: string[];
	tested_up_to: string;
	text_domain: string;
	theme_json_file?: { [ key: string ]: unknown };
	uri: string;
	version: string;
};
