import '../../../../css/src/index.scss';
import '../../../../css/src/tailwind.css';

import { useRef } from '@wordpress/element';
import { Snackbar, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React from 'react';

import { patternmanager } from '../../globals';

import PatternManagerContext from '../../contexts/PatternManagerContext';
import PatternManagerSnackbarContext from '../../contexts/PatternManagerNoticeContext';
import getNextPatternIds from '../../utils/getNextPatternIds';

// Hooks
import useThemeData from '../../hooks/useThemeData';
import useCurrentId from '../../hooks/useCurrentId';
import useCurrentView from '../../hooks/useCurrentView';
import usePatterns from '../../hooks/usePatterns';
import usePmContext from '../../hooks/usePmContext';
import useNoticeContext from '../../hooks/useNoticeContext';
import useSnackbar from '../../hooks/useNotice';

// Components
import ThemePatterns from '../ThemePatterns';
import PatternEditor from '../PatternEditor';

import type { InitialContext, Pattern } from '../../types';

export default function PatternManagerApp() {
	const providerValue = useSnackbar();

	return (
		<PatternManagerSnackbarContext.Provider value={ providerValue }>
			<PatternManagerContextHydrator />
		</PatternManagerSnackbarContext.Provider>
	);
}

function PatternManagerContextHydrator() {
	const currentView = useCurrentView( 'theme_patterns' );
	const patternEditorIframe = useRef< HTMLIFrameElement | null >( null );
	const templateEditorIframe = useRef< HTMLIFrameElement | null >( null );
	const patterns = usePatterns();

	const currentTheme = useThemeData(
		patternmanager.theme,
		patternEditorIframe,
		templateEditorIframe,
		patterns
	);
	const currentPatternId = useCurrentId( '' );

	let currentPattern: Pattern | null = null;

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

	const providerValue: InitialContext = {
		currentView,
		currentPatternId,
		currentPattern,
		currentTheme,
		patterns,
		siteUrl: patternmanager.siteUrl,
		apiEndpoints: patternmanager.apiEndpoints,
		patternEditorIframe,
		templateEditorIframe,
	};

	return (
		<PatternManagerContext.Provider value={ providerValue }>
			<PatternManager />
		</PatternManagerContext.Provider>
	);
}

function PatternManager() {
	const { currentPatternId, currentView, currentTheme } = usePmContext();
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
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								disabled={
									currentTheme?.fetchInProgress
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
											'Saving',
											'pattern-manager'
										) }
									</>
								) : (
									__( 'Save', 'pattern-manager' )
								) }
							</button>
							<button
								className="inline-flex items-center leading-5 text-sm px-4 py-2 border border-4 border-transparent font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
								onClick={ () => {
									// Get the new pattern title and slug.
									const {
										patternTitle,
										patternSlug,
									} = getNextPatternIds(
										currentTheme?.data
											?.included_patterns
									);

									currentTheme
										.createPattern( {
											type: 'pattern',
											title: patternTitle,
											name: patternSlug,
											slug: patternSlug,
											categories: [],
											keywords: [],
											blockTypes: [],
											postTypes: [],
											inserter: true,
											description: '',
											viewportWidth: '',
											content: '',
										} )
										.then( () => {
											currentPatternId.set(
												patternSlug
											);
											currentView.set(
												'pattern_editor'
											);
										} );
								} }
							>
								{ __(
									'Add New Pattern',
									'pattern-manager'
								) }
							</button>
						</div>
					</div>
				</div>
			</div>

			{ currentTheme?.data ? (
				<>
					<ThemePatterns
						isVisible={
							'theme_patterns' === currentView.currentView
						}
					/>
					<PatternEditor
						visible={ 'pattern_editor' === currentView.currentView }
					/>
				</>
			) : null }
		</>
	);
}
