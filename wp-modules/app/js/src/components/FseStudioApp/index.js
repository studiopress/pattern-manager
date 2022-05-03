// @ts-check

/**
 * Fse Studio
 */

import '../../../../css/src/index.scss';
import '../../../../css/src/tailwind.css';

import { useEffect, useState, useRef } from '@wordpress/element';
import { Snackbar } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';

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
import useThemeData from '../../hooks/useThemeData';
import useCurrentView from '../../hooks/useCurrentView';
import useStudioContext from '../../hooks/useStudioContext';
import useSnackbarContext from '../../hooks/useSnackbarContext';
import useSnackbar from '../../hooks/useSnackbar';

// Components
import ThemeSetup from '../ThemeSetup';
import ThemePatterns from '../ThemePatterns';
import ThemeTemplateFiles from '../ThemeTemplateFiles';
import SiteEditor from '../SiteEditor';
import PatternEditor from '../PatternEditor';
import ThemeJsonEditor from '../ThemeJsonEditor';
import FseStudioHelp from '../FseStudioHelp';
import GettingStarted from '../GettingStarted';

// Utils
import classNames from '../../utils/classNames';

/**
 * @typedef {{
 *  currentView: ReturnType<import('../../hooks/useCurrentView').default>,
 *  currentPatternId: ReturnType<import('../../hooks/useCurrentId').default>,
 *  currentPattern: ReturnType<import('../../hooks/useThemes').default>,
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
	const currentView = useCurrentView( 'theme_setup' );
	const patternEditorIframe = useRef();
	const [blockEditorLoaded, setBlockEditorLoaded] = useState( false );
	const themes = useThemes( {
		themes: fsestudio.themes,
	} );
	const currentThemeId = useCurrentId( fsestudio.initialTheme );
	const currentTheme   = useThemeData(
		uuidv4(),
		themes,
		patternEditorIframe,
		currentView
	);

	const currentPatternId = useCurrentId('');
	let currentPattern = null;
	
	if ( currentPatternId?.value ) {
		// If the pattern name is found in the theme's included_patterns object.
		if ( currentTheme?.data?.included_patterns?.hasOwnProperty( currentPatternId?.value ) ) {
			currentPattern = currentTheme.data.included_patterns[currentPatternId?.value];
		}
		// If the pattern name is found in the theme's template_files object.
		if ( currentTheme?.data?.template_files?.hasOwnProperty( currentPatternId?.value ) ) {
			currentPattern = currentTheme.data.template_files[currentPatternId?.value];
		}
		// If the pattern name is found in the theme's template_parts object.
		if ( currentTheme?.data?.template_parts?.hasOwnProperty( currentPatternId?.value ) ) {
			currentPattern = currentTheme.data.template_parts[currentPatternId?.value];
		}
	}

	/** @type {InitialContext} */
	const providerValue = {
		currentView,
		currentPatternId,
		currentPattern,
		themes,
		currentThemeId,
		currentTheme,
		siteUrl: fsestudio.siteUrl,
		apiEndpoints: fsestudio.apiEndpoints,
		blockEditorSettings: fsestudio.blockEditorSettings,
		patternEditorIframe,
		blockEditorLoaded,
		setBlockEditorLoaded,
	};

	return (
		<FseStudioContext.Provider value={ providerValue }>
			<FseStudio />
		</FseStudioContext.Provider>
	);
}

function FseStudio() {
	// @ts-ignore
	const { currentView, currentTheme, themes, currentThemeId, setBlockEditorLoaded } = useStudioContext();
	const snackBar = useSnackbarContext();
	
	useEffect( () => {
		console.log( 'The current view just changed', currentView );
		// Update the theme data from the disk whenever the currentview changes.
		currentTheme.get();
	}, [currentView.currentView] );

	function renderThemeSelector() {
		const renderedThemes = [];

		renderedThemes.push(
			<option key={ 1 }>{ __( 'Choose a theme', 'fse-studio' ) }</option>
		);

		let counter = 3;
		console.log( currentTheme );
		
		for ( const thisTheme in themes.themes ) {
			const themeInQuestion = themes.themes[ thisTheme ];
			renderedThemes.push(
				<option key={ counter } value={ thisTheme }>
					{ thisTheme === currentThemeId.value
						? currentTheme.data?.name
						: themeInQuestion?.name }
				</option>
			);
			counter++;
		}

		return (
			<>
				<select
					className="block w-60 h-full pl-3 pr-10 py-2 text-base !border-gray-300 !focus:outline-none !focus:ring-wp-blue !focus:border-wp-blue !sm:text-sm !rounded-sm"
					id="themes"
					value={ currentThemeId.value }
					onChange={ ( event ) => {
						currentThemeId.set( event.target.value );
					} }
				>
					{ renderedThemes }
				</select>
			</>
		);
	}

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
			<div className="sticky top-0 z-10 flex-shrink-0 flex h-20 bg-wp-black shadow">
				<div className="flex-1 flex">
					<div className="flex w-full gap-8 max-w-7xl mx-auto justify-between items-center">
						<div className="flex gap-8">
							<button
								type="button"
								className="inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue"
								onClick={ () => {
									currentView.set( 'theme_setup' );
								} }
							>
								{ __( 'Theme Setup', 'fse-studio' ) }
							</button>
							<button
								disabled={currentTheme.data ? false : true}
								type="button"
								className="inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue"
								onClick={ () => {
									currentView.set( 'themejson_editor' );
								} }
							>
								{ __( 'Styles and Settings', 'fse-studio' ) }
							</button>
							<button
								disabled={currentTheme.data ? false : true}
								type="button"
								className="inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue"
								onClick={ () => {
									currentView.set( 'theme_templates' );
								} }
							>
								{ __( 'Theme Templates', 'fse-studio' ) }
							</button>
							<button
								disabled={currentTheme.data ? false : true}
								type="button"
								className="inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue"
								onClick={ () => {
									currentView.set( 'theme_patterns' );
								} }
							>
								{ __( 'Theme Patterns', 'fse-studio' ) }
							</button>
						</div>
						
						<div className="flex sm:flex-row flex-col gap-2">
							{
								// In order to render the selector…
								// There should be at least 1 theme other than the currently selected theme.
								// Or the current theme should have been saved to disk.
								Object.keys( themes.themes ).some(
									( themeName ) =>
										themeName !== currentThemeId.value ||
										currentTheme.existsOnDisk
								) ? (
									<>
										<div>
											<label
												htmlFor="themes"
												className="block text-sm font-medium text-gray-700 visuallyhidden"
											>
												{ __(
													'Choose a theme',
													'fse-studio'
												) }
											</label>
											{ renderThemeSelector() }
										</div>
									</>
								) : null
							}
							<div className="flex flex-col">
								<button
									type="button"
									className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
									onClick={ () => {
										/** @type {import('../../hooks/useThemeData').Theme} */
										const newThemeData = {
											name: 'My New Theme',
											dirname: 'my-new-theme',
											namespace: 'MyNewTheme',
											uri: 'mysite.com',
											author: 'Me',
											author_uri: 'mysite.com',
											description: 'My new FSE Theme',
											tags: '',
											tested_up_to: '5.9',
											requires_wp: '5.9',
											requires_php: '7.3',
											version: '1.0.0',
											text_domain: 'my-new-theme',
										};

										const themeId = uuidv4();
										themes.setThemes( {
											...themes.themes,
											[themeId]: newThemeData,
										} );
	
										// Switch to the newly created theme.
										currentThemeId.set( themeId );
									} }
								>
									{ __( 'Create New', 'fse-studio' ) }
								</button>
							</div>
							{ currentTheme?.data ? (
								<button
									type="button"
									className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
									onClick={() => {
									
										currentTheme.save();
									}}
								>
									{ __( 'Save Theme', 'fse-studio' ) }
								</button>
							) : null }
						</div>
					</div>
				</div>
			</div>
			
			{ currentTheme?.data ? (
				<>
					<ThemeSetup
						isVisible={ 'theme_setup' === currentView.currentView }
					/>
					<ThemePatterns
						isVisible={ 'theme_patterns' === currentView.currentView }
					/>
					<div
						hidden={ 'theme_templates' !== currentView.currentView }
					>
						<SiteEditor />
					</div>
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
			) : (
				<GettingStarted />
			) }
		</>
	);
}
