//  Assets
import '../../../../css/src/index.scss';
import wpeLogoDefaultCropped from '../../../../img/WPE-LOGO-S-Default-Cropped.svg';

// WP dependencies
import { useRef } from '@wordpress/element';
import { Snackbar, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Globals
import { patternManager } from '../../globals';

// Contexts
import PatternManagerContext from '../../contexts/PatternManagerContext';
import NoticeContext from '../../contexts/NoticeContext';

// Hooks
import useCurrentId from '../../hooks/useCurrentId';
import useCurrentView from '../../hooks/useCurrentView';
import usePatterns from '../../hooks/usePatterns';
import usePmContext from '../../hooks/usePmContext';
import useNoticeContext from '../../hooks/useNoticeContext';
import useNotice from '../../hooks/useNotice';

// Components
import Patterns from '../Patterns';
import PatternEditor from '../PatternEditor';

// Utils
import getNextPatternIds from '../../utils/getNextPatternIds';

// Types
import type { InitialContext } from '../../types';

export default function PatternManagerApp() {
	const providerValue = useNotice();

	return (
		<NoticeContext.Provider value={ providerValue }>
			<PatternManagerContextHydrator />
		</NoticeContext.Provider>
	);
}

function PatternManagerContextHydrator() {
	const currentView = useCurrentView( 'theme_patterns' );
	const patternEditorIframe = useRef< HTMLIFrameElement | null >( null );
	const templateEditorIframe = useRef< HTMLIFrameElement | null >( null );
	const patterns = usePatterns( patternManager.patterns );

	const currentPatternId = useCurrentId( '' );
	const currentPattern = patterns.data?.[ currentPatternId.value ] ?? null;

	const providerValue: InitialContext = {
		currentView,
		currentPatternId,
		currentPattern,
		patterns,
		siteUrl: patternManager.siteUrl,
		apiEndpoints: patternManager.apiEndpoints,
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
				<div className="nav-container-logo">
					<img
						className="logo-svg"
						aria-hidden="true"
						alt=""
						src={ wpeLogoDefaultCropped }
					/>
					<span className="logo-title">
						{ __( 'Pattern Manager', 'pattern-manager' ) }
					</span>
				</div>

				<div className="nav-container-inner">
					<button
						type="button"
						disabled={ patterns.fetchInProgress }
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
								getNextPatternIds( patterns.data );

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
						{ __( 'Create New Pattern', 'pattern-manager' ) }
					</button>
				</div>
			</div>
			{ 'theme_patterns' === currentView.currentView ? (
				<Patterns />
			) : null }
			{ 'pattern_editor' === currentView.currentView ? (
				<PatternEditor />
			) : null }
		</>
	);
}
