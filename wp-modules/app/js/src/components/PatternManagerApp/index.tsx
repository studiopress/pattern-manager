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
	const patterns = usePatterns( patternmanager.patterns );

	const currentPatternId = useCurrentId( '' );

	let currentPattern: Pattern | null = null;

	if ( currentPatternId?.value ) {
		currentPattern = patterns.data?.[ currentPatternId?.value ] ?? null;
	}

	const providerValue: InitialContext = {
		currentView,
		currentPatternId,
		currentPattern,
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
	const { currentPatternId, currentView, patterns } = usePmContext();
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
						disabled={ patterns?.fetchInProgress }
						className="nav-button"
						onClick={ () => {
							patterns.save();
						} }
					>
						{ patterns.isSaving ? (
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
								getNextPatternIds( patterns?.data );

							patterns
								.createPattern( {
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

			{ patterns?.data ? (
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
