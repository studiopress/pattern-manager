import { Pattern, Theme } from '../types';

declare global {
	interface Window {
		fsestudio: InitialFseStudio;
	}
}

type InitialFseStudio = {
	apiNonce: string,
	apiEndpoints: {
		getAppState: string,
		getPatternEndpoint: string,
		getThemeEndpoint: string,
		getThemeJsonFileEndpoint: string,
		savePatternEndpoint: string,
		saveThemeEndpoint: string,
		switchThemeEndpoint: string,
		saveThemeJsonFileEndpoint: string,
		exportThemeEndpoint: string,
	},
	blockEditorSettings: Partial<{
		'__unstableResolvedAssets': { styles: string },
		styles: Record<string, unknown>[]
	}>,
	initialTheme: string,
	patterns: { [ key: string ]: Pattern },
	siteUrl: string,
	adminUrl: string,
	themes: { [ key: string ]: Theme }
}

export const fsestudio = window.fsestudio;
