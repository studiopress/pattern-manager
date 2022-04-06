// @ts-check

/**
 * Fse Studio
 */

import ReactDOM from 'react-dom';

import FseStudioApp from './components/FseStudioApp';

/**
 * @typedef {{
 *  apiNonce: string,
 *  apiEndpoints: {
 *   getPatternEndpoint: string,
 *   getThemeEndpoint: string,
 *   getThemeJsonFileEndpoint: string,
 *   savePatternEndpoint: string,
 *   saveThemeEndpoint: string,
 *   saveThemeJsonFileEndpoint:	string,
 *   exportThemeEndpoint:	string,
 *  },
 *  blockEditorSettings: Partial<{
 *   '__unstableResolvedAssets': {styles: string},
 *   styles: Record<string, unknown>[]
 *  }>,
 *  initialTheme: string,
 *  patterns: Record<string, import('./components/PatternPicker').Pattern>,
 *  siteUrl: string,
 *  themeJsonFiles: Record<string, {
 *   content: string,
 *   name: string,
 *   patternPreviewParts?: import('./hooks/useThemeJsonFile').ThemeData | null
 *  }>,
 *  themes: Record<string, import('./hooks/useThemeData').Theme>
 * }} InitialFseStudio
 */

/**
 * @typedef {{
 *  currentView: ReturnType<import('./hooks/useCurrentView').default>,
 *  patterns: ReturnType<import('./hooks/usePatterns').default>,
 *  themes: ReturnType<import('./hooks/useThemes').default>,
 *  currentThemeId: ReturnType<import('./hooks/useCurrentId').default>,
 *  currentTheme: ReturnType<import('./hooks/useThemeData').default>,
 *  themeJsonFiles: ReturnType<import('./hooks/useThemeJsonFiles').default>,
 *  currentThemeJsonFileId: ReturnType<import('./hooks/useCurrentId').default>,
 *  currentThemeJsonFile: ReturnType<import('./hooks/useThemeJsonFile').default>,
 *  siteUrl: InitialFseStudio['siteUrl'],
 *  apiEndpoints: InitialFseStudio['apiEndpoints'],
 *  blockEditorSettings: InitialFseStudio['blockEditorSettings']
 * }} InitialContext
 */

ReactDOM.render( <FseStudioApp />, document.getElementById( 'fsestudioapp' ) );
