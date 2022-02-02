/**
 * FseStudio App
 */

const { __ } = wp.i18n;

import '@wordpress/core-data';
import { useContext } from '@wordpress/element';
import { PatternEditorApp } from './PatternEditor.js';
import { ThemeEditorApp } from './ThemeEditor.js';
import { ThemeJsonEditorApp } from './ThemeJsonEditor.js';
import {
	FseStudioContext,
	useThemes,
	usePatterns,
	useThemeJsonFiles,
	useCurrentView,
} from './../non-visual/non-visual-logic.js';
import { FseStudioHeader } from './Header.js';

export function FseStudioApp() {
	return (
		<FseStudioContext.Provider
			value={ {
				currentView: useCurrentView( { currentView: '' } ),
				patterns: usePatterns( fsestudio.patterns ),
				themes: useThemes( { themes: fsestudio.themes } ),
				themeJsonFiles: useThemeJsonFiles( fsestudio.themeJsonFiles ),
				siteUrl: fsestudio.siteUrl,
				apiEndpiints: fsestudio.api_endpoints,
			} }
		>
			<FseStudio />
		</FseStudioContext.Provider>
	);
}

function FseStudio() {
	const { currentView } = useContext( FseStudioContext );

	function renderEditor() {
		if ( 'themejson' === currentView.currentView ) {
			return <ThemeJsonEditorApp />;
		}

		if ( 'themes' === currentView.currentView ) {
			return <ThemeEditorApp />;
		}

		if ( 'patterns' === currentView.currentView ) {
			return <PatternEditorApp />;
		}

		if ( 'customblocks' === currentView.currentView ) {
			return (
				<h1 style={ { margin: '50px' } }>
					{ 'Imagine the Custom Blocks editor here.' }
				</h1>
			);
		}
	}

	return (
		<div className="fsestudio">
			<div className="fsestudio-header">
				<div style={ { textAlign: 'center' } }>
					<span
						style={ { display: 'inline-block', fontWeight: '700' } }
					>
						FSE Theme Manager
					</span>
				</div>
				<div className="fsestudio-controls">
					<button
						className="button"
						onClick={ () => {
							currentView.set( 'themes' );
						} }
					>
						FSE Themes
					</button>
					<button
						className="button"
						onClick={ () => {
							currentView.set( 'patterns' );
						} }
					>
						Patterns
					</button>
					<button
						className="button"
						onClick={ () => {
							currentView.set( 'themejson' );
						} }
					>
						Theme JSON Files
					</button>
				</div>
			</div>
			{ renderEditor() }
		</div>
	);
}
