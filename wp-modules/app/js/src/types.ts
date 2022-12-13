/* eslint-disable no-undef, camelcase */

import React from 'react';
import useNotice from './hooks/useNotice';
import useCurrentView from './hooks/useCurrentView';
import useCurrentId from './hooks/useCurrentId';
import useThemes from './hooks/useThemes';
import useThemeData from './hooks/useThemeData';
import usePatterns from './hooks/usePatterns';
import { PatternType } from './enums';

export type FseStudioViews =
	| 'theme_setup'
	| 'create_theme'
	| 'theme_preview'
	| 'theme_patterns'
	| 'theme_templates'
	| 'template_parts'
	| 'pattern_editor'
	| 'themejson_editor'
	| 'fse_studio_help';

export type NoticeContext = ReturnType< typeof useNotice >;

export type InitialContext = {
	currentView: ReturnType< typeof useCurrentView >;
	currentPatternId: ReturnType< typeof useCurrentId >;
	currentPattern: Pattern;
	themes: ReturnType< typeof useThemes >;
	currentThemeId: ReturnType< typeof useCurrentId >;
	currentTheme: ReturnType< typeof useThemeData >;
	currentStyleVariationId: ReturnType< typeof useCurrentId >;
	siteUrl: InitialFseStudio[ 'siteUrl' ];
	apiEndpoints: InitialFseStudio[ 'apiEndpoints' ];
	blockEditorSettings: InitialFseStudio[ 'blockEditorSettings' ];
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
	blockEditorSettings: {
		__unstableResolvedAssets?: { styles: string };
		styles?: { [ key: string ]: unknown }[];
	};
	initialTheme: string;
	patterns: Patterns;
	siteUrl: string;
	adminUrl: string;
	themes: Themes;
	schemas: {
		themejson: {
			definitions: {
				settingsPropertiesComplete: {
					allOf: {
						properties: {
							[ key: string ]: unknown;
						};
					}[];
				};
			};
		};
	};
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
	included_patterns?: Patterns;
	requires_php: string;
	requires_wp: string;
	rest_route?: string;
	styles: { [ key: string ]: Style };
	tags: string;
	template_files?: string[];
	template_parts?: string[];
	tested_up_to: string;
	text_domain: string;
	theme_json_file?: { [ key: string ]: unknown };
	uri: string;
	version: string;
};

export type Themes = {
	[ key: string ]: Theme;
};
