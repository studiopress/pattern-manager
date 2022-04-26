// @ts-check

/**
 * Fse Studio
 */

import '../../../../css/src/index.scss';
import '../../../../css/src/tailwind.css';

import { useEffect, useState } from '@wordpress/element';
import { Snackbar } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Icons
import {
	Icon,
	wordpress,
	layout,
	file,
	globe,
	info,
	close,
	chevronLeft,
} from '@wordpress/icons';

import { fsestudio } from '../../globals';

import FseStudioContext from '../../contexts/FseStudioContext';
import FseStudioSnackbarContext from '../../contexts/FseStudioSnackbarContext';

// Hooks
import useThemes from '../../hooks/useThemes';
import useCurrentId from '../../hooks/useCurrentId';
import useMounted from '../../hooks/useMounted';
import useThemeData from '../../hooks/useThemeData';
import usePatterns from '../../hooks/usePatterns';
import usePatternData from '../../hooks/usePatternData';
import useCurrentView from '../../hooks/useCurrentView';
import useStudioContext from '../../hooks/useStudioContext';
import useSnackbarContext from '../../hooks/useSnackbarContext';
import useSnackbar from '../../hooks/useSnackbar';

// Components
import ThemeManager from '../ThemeManager';
import PatternEditor from '../PatternEditor';
import ThemeJsonEditor from '../ThemeJsonEditor';
import FseStudioHelp from '../FseStudioHelp';

// Utils
import classNames from '../../utils/classNames';

/**
 * @typedef {{
 *  currentView: ReturnType<import('../../hooks/useCurrentView').default>,
 *  patterns: ReturnType<import('../../hooks/usePatterns').default>,
 *  currentPatternId: ReturnType<import('../../hooks/useCurrentId').default>,
 *  currentPattern: ReturnType<import('../../hooks/usePatternData').default>,
 *  themes: ReturnType<import('../../hooks/useThemes').default>,
 *  currentThemeId: ReturnType<import('../../hooks/useCurrentId').default>,
 *  currentTheme: ReturnType<import('../../hooks/useThemeData').default>,
 *  siteUrl: typeof import('../../globals').fsestudio.siteUrl,
 *  apiEndpoints: typeof import('../../globals').fsestudio.apiEndpoints,
 *  blockEditorSettings: typeof import('../../globals').fsestudio.blockEditorSettings
 * }} InitialContext
 */

export default function FseStudioApp() {
	/** @type {ReturnType<import('../../hooks/useSnackbar').default>} */
	const providerValue = useSnackbar();
	return (
		<FseStudioSnackbarContext.Provider value={ providerValue }>
			<FseStudioContextHydrator />
		</FseStudioSnackbarContext.Provider>
	);
}

function FseStudioContextHydrator() {
	const currentView = useCurrentView( 'theme_manager' );
	const themes = useThemes( {
		themes: fsestudio.themes,
	} );
	const currentThemeId = useCurrentId( fsestudio.initialTheme );
	const currentTheme   = useThemeData(
		currentThemeId.value,
		themes,
	);
	
	const patterns = usePatterns( fsestudio.patterns );
	const currentPatternId = useCurrentId('');
	const currentPattern   = usePatternData(
		currentPatternId.value,
		patterns,
		currentTheme
	);
	
	useEffect( () => {
		getUpdatedAppState();
	}, [currentView.currentView] );

	function getUpdatedAppState() {
		fetch( fsestudio.apiEndpoints.getAppState, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-WP-Nonce': fsestudio.apiNonce,
			},
			
		} )
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				patterns.setPatterns( {...data.patterns} );
				themes.setThemes( {...data.themes } );
				currentTheme.set( {...data.themes[currentThemeId.value] } );
			} );
	}

	/** @type {InitialContext} */
	const providerValue = {
		currentView,
		patterns,
		currentPatternId,
		currentPattern,
		themes,
		currentThemeId,
		currentTheme,
		siteUrl: fsestudio.siteUrl,
		apiEndpoints: fsestudio.apiEndpoints,
		blockEditorSettings: fsestudio.blockEditorSettings,
	};

	return (
		<FseStudioContext.Provider value={ providerValue }>
			<FseStudio />
		</FseStudioContext.Provider>
	);
}

function FseStudio() {
	// @ts-ignore
	const { currentView, currentTheme } = useStudioContext();
	const snackBar = useSnackbarContext();

	return (
		<>
			{ snackBar.value ? (
				<Snackbar
					onRemove={ () => {
						snackBar.setValue( null );
					} }
				>
					{ snackBar.value }
				</Snackbar>
			) : null }
			<div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-wp-black shadow">
				<div className="flex-1 flex">
					<div className="flex w-full gap-8 max-w-7xl mx-auto">
						<button
							type="button"
							className="inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue"
							onClick={ () => {
								currentView.set( 'theme_manager' );
							} }
						>
							{ __( 'Theme Setup', 'fse-studio' ) }
						</button>
						<button
							type="button"
							className="inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue"
							onClick={ () => {
								currentView.set( 'themejson_editor' );
							} }
						>
							{ __( 'Styles and Settings', 'fse-studio' ) }
						</button>
						<button
							type="button"
							className="inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue"
							onClick={ () => {
								currentView.set( 'theme_manager' );
							} }
						>
							{ __( 'Template Files', 'fse-studio' ) }
						</button>
						<button
							type="button"
							className="inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue"
							onClick={ () => {
								currentView.set( 'pattern_editor' );
							} }
						>
							{ __( 'Patterns in Theme', 'fse-studio' ) }
						</button>
						
					</div>
				</div>
			</div>
			
			<ThemeManager
				visible={ 'theme_manager' === currentView.currentView }
			/>
			<PatternEditor
				visible={ 'pattern_editor' === currentView.currentView }
			/>
			<ThemeJsonEditor
				visible={ 'themejson_editor' === currentView.currentView }
			/>
			<FseStudioHelp
				visible={ 'fse_studio_help' === currentView.currentView }
			/>
		</>
	);
}
