// @ts-check

/**
 * Fse Studio
 */

import ReactDOM from 'react-dom';

import FseStudioApp from './components/FseStudioApp';

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
 *  siteUrl: import('./globals').InitialFseStudio['siteUrl'],
 *  apiEndpoints: import('./globals').InitialFseStudio['apiEndpoints'],
 *  blockEditorSettings: import('./globals').InitialFseStudio['blockEditorSettings']
 * }} InitialContext
 */

ReactDOM.render( <FseStudioApp />, document.getElementById( 'fsestudioapp' ) );
