// @ts-check

/**
 * Fse Studio
 */

import '../../../../css/src/index.scss';
import '../../../../css/src/tailwind.css';

import { useEffect, useState, useRef } from '@wordpress/element';
import { Snackbar, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import logo from '../../../../img/logo.svg';
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
import ThemePreview from '../ThemePreview';
import TemplateEditor from '../TemplateEditor';
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
	const templateEditorIframe = useRef();
	const [blockEditorLoaded, setBlockEditorLoaded] = useState( false );
	const themes = useThemes( {
		themes: fsestudio.themes,
	} );
	const currentThemeId = useCurrentId( fsestudio.initialTheme );
	const currentTheme   = useThemeData(
		currentThemeId.value,
		themes,
		patternEditorIframe,
		templateEditorIframe,
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
		templateEditorIframe,
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
	const { currentView, currentTheme, templateEditorIframe, themes, currentThemeId, setBlockEditorLoaded } = useStudioContext();
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
			<div className="sticky top-0 z-10 flex-shrink-0 flex h-20 bg-wp-black shadow">
				<div className="flex-1 flex">
					<div className="flex w-full gap-8 mx-auto justify-between items-center px-10">
						<div className="flex items-center gap-12">
							<img className="w-[120px]" src={ logo } />
							<div className="flex gap-8">
								<button
									type="button"
									className={"inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue" + ( currentView.currentView === 'theme_setup' ? ' underline' : '' ) }
									onClick={ () => {
										currentView.set( 'theme_setup' );
									} }
								>
									{ __( 'Theme Details', 'fse-studio' ) }
								</button>
								<button
									disabled={currentTheme.data && currentTheme.existsOnDisk ? false : true}
									type="button"
									className={ "inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue" + ( currentView.currentView === 'themejson_editor' ? ' underline' : '' ) }
									onClick={ () => {
										currentView.set( 'themejson_editor' );
									} }
								>
									{ __( 'Styles and Settings', 'fse-studio' ) }
								</button>
								<button
									disabled={currentTheme.data && currentTheme.existsOnDisk ? false : true}
									type="button"
									className={ "inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue" + ( currentView.currentView === 'theme_patterns' ? ' underline' : '' ) }
									onClick={ () => {
										currentView.set( 'theme_patterns' );
									} }
								>
									{ __( 'Theme Patterns', 'fse-studio' ) }
								</button>
								<button
									style={{display: window.location.href.includes( 'tryTemplates' ) ? '' : 'none'}}
									disabled={currentTheme.data && currentTheme.existsOnDisk ? false : true}
									type="button"
									className={ "inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue" + ( currentView.currentView === 'theme_templates' ? ' underline' : '' ) }
									onClick={ () => {
										currentView.set( 'theme_templates' );
										if ( templateEditorIframe.current ) {
											templateEditorIframe.current.contentWindow.postMessage(
												JSON.stringify( {
													message: 'fsestudio_click_templates',
												} )
											);
										}
									} }
								>
									{ __( 'Theme Templates', 'fse-studio' ) }
								</button>
								<button
									style={{display: window.location.href.includes( 'tryTemplates' ) ? '' : 'none'}}
									disabled={currentTheme.data && currentTheme.existsOnDisk ? false : true}
									type="button"
									className={ "inline-flex items-center text-base font-medium rounded-sm shadow-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-wp-blue" + ( currentView.currentView === 'template_parts' ? ' underline' : '' ) }
									onClick={ () => {
										currentView.set( 'template_parts' );
										if ( templateEditorIframe.current ) {
											templateEditorIframe.current.contentWindow.postMessage(
												JSON.stringify( {
													message: 'fsestudio_click_template_parts',
												} )
											);
										}
									} }
								>
									{ __( 'Template Parts', 'fse-studio' ) }
								</button>
							</div>
						</div>
						
						<div className="flex sm:flex-row flex-col gap-2">
							{ currentTheme?.data ? (
								<>
									<button
										style={{display: window.location.href.includes( 'tryPreview' ) ? '' : 'none'}}
										type="button"
										className="inline-flex items-center px-4 py-2 border border-4 border-transparent font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
										onClick={() => {
										
											currentView.set( 'theme_preview' );
										}}
									>
										{ __( 'Preview Theme', 'fse-studio' ) }
									</button>
									<button
										type="button"
										disabled={ currentTheme.fetchInProgress }
										className="inline-flex items-center px-4 py-2 border border-4 border-transparent font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
										onClick={() => {
										
											currentTheme.save();
										}}
									>
										{ currentTheme.isSaving ? (
											<>
											<Spinner />
											{ __( 'Saving Your Theme', 'fse-studio' ) }
											</>
										) : (
											__( 'Save Your Theme', 'fse-studio' )
										) }
										
									</button>
								</>
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
					<ThemePreview
						isVisible={ 'theme_preview' === currentView.currentView }
					/>
					<ThemePatterns
						isVisible={ 'theme_patterns' === currentView.currentView }
					/>
					<div
						hidden={ 'theme_templates' !== currentView.currentView && 'template_parts' !== currentView.currentView }
					>
						<TemplateEditor />
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
