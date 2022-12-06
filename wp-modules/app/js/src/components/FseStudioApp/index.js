/**
 * Fse Studio
 */

import '../../../../css/src/index.scss';
import '../../../../css/src/tailwind.css';

import { useRef } from '@wordpress/element';
import { Snackbar, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React from 'react';

import { fsestudio } from '../../globals';

import FseStudioContext from '../../contexts/FseStudioContext';
import FseStudioSnackbarContext from '../../contexts/FseStudioNoticeContext';

// Hooks
import useThemes from '../../hooks/useThemes';
import useCurrentId from '../../hooks/useCurrentId';
import useThemeData from '../../hooks/useThemeData';
import useCurrentView from '../../hooks/useCurrentView';
import usePatterns from '../../hooks/usePatterns';
import useStudioContext from '../../hooks/useStudioContext';
import useNoticeContext from '../../hooks/useNoticeContext';
import useSnackbar from '../../hooks/useNotice';

// Components
import CreateTheme from '../CreateTheme';
import ThemeSetup from '../ThemeSetup';
import ThemePatterns from '../ThemePatterns';
import ThemePreview from '../ThemePreview';
import TemplateEditor from '../TemplateEditor';
import PatternEditor from '../PatternEditor';
import ThemeJsonEditor from '../ThemeJsonEditor';
import FseStudioHelp from '../FseStudioHelp';
import GettingStarted from '../GettingStarted';
import FseStudioNav from '../FseStudioNav';

export default function FseStudioApp() {
	/** @type {ReturnType<import('../../hooks/useNotice').default>} */
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
	const themes = useThemes( fsestudio.themes );
	const patterns = usePatterns();

	const currentStyleVariationId = useCurrentId( 'default-style' );
	const currentThemeId = useCurrentId( fsestudio.initialTheme );
	const currentTheme = useThemeData(
		currentThemeId.value,
		themes,
		patternEditorIframe,
		templateEditorIframe,
		currentStyleVariationId,
		patterns
	);

	const currentPatternId = useCurrentId( '' );

	let currentPattern = null;

	if ( currentPatternId?.value ) {
		// If the pattern name is found in the theme's included_patterns object.
		if (
			currentTheme?.data?.included_patterns?.hasOwnProperty(
				currentPatternId?.value
			)
		) {
			currentPattern =
				currentTheme.data.included_patterns[ currentPatternId?.value ];
		}
		// If the pattern name is found in the theme's template_files object.
		if (
			currentTheme?.data?.template_files?.hasOwnProperty(
				currentPatternId?.value
			)
		) {
			currentPattern =
				currentTheme.data.template_files[ currentPatternId?.value ];
		}
		// If the pattern name is found in the theme's template_parts object.
		if (
			currentTheme?.data?.template_parts?.hasOwnProperty(
				currentPatternId?.value
			)
		) {
			currentPattern =
				currentTheme.data.template_parts[ currentPatternId?.value ];
		}
	}

	/** @type {import('../../types').InitialContext} */
	const providerValue = {
		currentView,
		currentPatternId,
		currentPattern,
		themes,
		currentThemeId,
		currentTheme,
		currentStyleVariationId,
		patterns,
		siteUrl: fsestudio.siteUrl,
		apiEndpoints: fsestudio.apiEndpoints,
		blockEditorSettings: fsestudio.blockEditorSettings,
		patternEditorIframe,
		templateEditorIframe,
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
	const { snackBarValue, setSnackBarValue } = useNoticeContext();

	return (
		<>
			{ snackBarValue ? (
				<Snackbar
					onRemove={ () => {
						setSnackBarValue( null );
					} }
				>
					{ snackBarValue }
				</Snackbar>
			) : null }
			<div className="md:sticky top-0 z-10 flex-shrink-0 flex min-h-[5rem] bg-wp-black shadow">
				<div className="flex-1 flex">
					<div className="flex flex-wrap w-full gap-6 mx-auto justify-between items-center py-8 lg:py-4 px-8 lg:px-12">
						<div className="flex lg:flex-row flex-col gap-4 lg:gap-12">
							{ /* Nav options for opening and creating themes, along with standard view actions */ }
							<FseStudioNav />
						</div>

						<div className="flex flex-wrap gap-2">
							{ currentView?.currentView !== 'create_theme' ? (
								<>
									<button
										type="button"
										className="inline-flex items-center leading-5 text-sm px-4 py-2 border border-4 border-transparent font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
										onClick={ () => {
											currentView.set( 'theme_preview' );
										} }
									>
										{ __( 'Preview Theme', 'fse-studio' ) }
									</button>
									<button
										type="button"
										disabled={
											currentTheme.fetchInProgress
										}
										className="inline-flex items-center leading-5 text-sm px-4 py-2 border border-4 border-transparent font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
										onClick={ () => {
											currentTheme.save();
										} }
									>
										{ currentTheme.isSaving ? (
											<>
												<Spinner />
												{ __(
													'Saving Theme',
													'fse-studio'
												) }
											</>
										) : (
											__( 'Save Theme', 'fse-studio' )
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
					<CreateTheme
						isVisible={
							'create_theme' === currentView?.currentView
						}
					/>
					<ThemeSetup
						isVisible={ 'theme_setup' === currentView.currentView }
					/>
					<ThemePreview
						isVisible={
							'theme_preview' === currentView.currentView
						}
					/>
					<ThemePatterns
						isVisible={
							'theme_patterns' === currentView.currentView
						}
					/>
					<div
						hidden={
							'theme_templates' !== currentView.currentView &&
							'template_parts' !== currentView.currentView
						}
					>
						<TemplateEditor />
					</div>
					<PatternEditor
						visible={ 'pattern_editor' === currentView.currentView }
					/>
					<ThemeJsonEditor
						visible={
							'themejson_editor' === currentView.currentView
						}
					/>
					<FseStudioHelp
						visible={
							'fse_studio_help' === currentView.currentView
						}
					/>
				</>
			) : (
				<GettingStarted />
			) }
		</>
	);
}
