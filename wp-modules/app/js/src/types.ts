/* eslint-disable camelcase */

import React from 'react';
import useNotice from './hooks/useNotice';
import useCurrentView from './hooks/useCurrentView';
import useCurrentId from './hooks/useCurrentId';
import usePatterns from './hooks/usePatterns';

export type PatternManagerViews = 'theme_patterns' | 'pattern_editor';

export type NoticeContext = ReturnType< typeof useNotice >;

export type InitialContext = {
	currentView: ReturnType< typeof useCurrentView >;
	currentPatternId: ReturnType< typeof useCurrentId >;
	currentPattern?: Pattern;
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
		getPatternsEndpoint: string;
		savePatternsEndpoint: string;
	};
	siteUrl: string;
	adminUrl: string;
	patterns: Patterns;
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
	viewportWidth?: string | number;
};

export type Patterns = {
	[ key: string ]: Pattern;
};
