// @ts-check

import ReactDOM from 'react-dom';
import FseStudioApp from './components/FseStudioApp/test/FseStudioApp';

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

// @ts-ignore The global window.fsestudio exists.
export const fsestudio = /** @type {InitialFseStudio} */ ( window.fsestudio );

ReactDOM.render( <FseStudioApp />, document.getElementById( 'fsestudioapp' ) );
