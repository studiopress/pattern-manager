/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import '@wordpress/core-data';
import { useContext } from '@wordpress/element';
import { PatternEditorApp } from './PatternEditor.js';
import { ThemeEditorApp } from './ThemeEditor.js';
import { ThemeJsonEditor } from './ThemeJsonEditor.js';
import {
	FseThemeManagerContext,
	useThemes,
	usePatterns,
	useCurrentView,
} from './../non-visual/non-visual-logic.js';
import { FseThemeManagerHeader } from './Header.js';

export function FseThemeManagerApp() {
	return (
		<FseThemeManagerContext.Provider
			value={ {
				currentView: useCurrentView( { currentView: '' } ),
				patterns: usePatterns( fsethememanager.patterns ),
				themes: useThemes( { themes: fsethememanager.themes } ),
				siteUrl: fsethememanager.siteUrl,
				apiEndpiints: fsethememanager.api_endpoints,
			} }
		>
			<FseThemeManager />
		</FseThemeManagerContext.Provider>
	);
}

function FseThemeManager() {
	const { currentView } = useContext( FseThemeManagerContext );

	function renderEditor() {
		if ( 'themejson' === currentView.currentView ) {
			return <ThemeJsonEditor />;
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
		<div className="fsethememanager">
			<div className="fsethememanager-header">
				<div style={ { textAlign: 'center' } }>
					<span
						style={ { display: 'inline-block', fontWeight: '700' } }
					>
						FSE Theme Manager
					</span>
				</div>
				<div className="fsethememanager-controls">
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
