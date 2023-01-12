import '../../../../css/src/index.scss';

import { useRef } from '@wordpress/element';
import { Snackbar, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React from 'react';

import { patternmanager } from '../../globals';

import PatternManagerContext from '../../contexts/PatternManagerContext';
import PatternManagerSnackbarContext from '../../contexts/PatternManagerNoticeContext';
import getNextPatternIds from '../../utils/getNextPatternIds';

// Hooks
import useCurrentId from '../../hooks/useCurrentId';
import useThemeData from '../../hooks/useThemeData';
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
			<div className="patternmanager-nav-container">
				<div className="nav-container-inner">
					<button
						type="button"
						disabled={ currentTheme?.fetchInProgress }
						className="nav-button"
						onClick={ () => {
							currentTheme.save();
						} }
					>
						{ currentTheme.isSaving ? (
							<>
								<Spinner />
								{ __( 'Saving', 'pattern-manager' ) }
							</>
						) : (
							__( 'Save', 'pattern-manager' )
						) }
					</button>
					<button
						className="nav-button"
						onClick={ () => {
							// Get the new pattern title and slug.
							const { patternTitle, patternSlug } =
								getNextPatternIds(
									currentTheme?.data?.included_patterns
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
									currentPatternId.set( patternSlug );
									currentView.set( 'pattern_editor' );
								} );
						} }
					>
						{ __( 'Add New Pattern', 'pattern-manager' ) }
					</button>
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
