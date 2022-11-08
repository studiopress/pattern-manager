/**
 * @typedef {{
 *  apiNonce: string,
 *  apiEndpoints: {
 *   getAppState: string,
 *   getPatternEndpoint: string,
 *   getThemeEndpoint: string,
 *   getThemeJsonFileEndpoint: string,
 *   savePatternEndpoint: string,
 *   saveThemeEndpoint: string,
 *   switchThemeEndpoint: string,
 *   saveThemeJsonFileEndpoint:	string,
 *   exportThemeEndpoint:	string,
 *  },
 *  blockEditorSettings: Partial<{
 *   '__unstableResolvedAssets': {styles: string},
 *   styles: Record<string, unknown>[]
 *  }>,
 *  initialTheme: string,
 *  patterns: Record<string, import('../types').Pattern>,
 *  siteUrl: string,
 *  adminUrl: string,
 *  themeJsonFiles: Record<string, {
 *   content: string,
 *   name: string,
 *   patternPreviewParts?: import('../../hooks/useThemeJsonFile').ThemeData | null
 *  }>,
 *  themes: Record<string, import('../../hooks/useThemeData').Theme>
 * }} InitialFseStudio
 */

/** @type {InitialFseStudio} */
export const fsestudio = window.fsestudio;
