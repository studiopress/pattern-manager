// WP dependencies
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import {
	useState,
	useEffect,
	createInterpolateElement,
} from '@wordpress/element';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Globals
import { patternManager } from '../../globals';

// Utils
import convertToSlug from '../../utils/convertToSlug';
import { Pattern } from '../../types';

// Types
import type { MutableRefObject } from 'react';

export default function PatternEditor() {
	const { currentPatternId } = usePmContext();

	return (
		<div className="patternmanager-pattern-work-area">
			{ currentPatternId.value ? <BlockEditor /> : null }
		</div>
	);
}

export function BlockEditor() {
	const { currentPattern, currentPatternId, patternEditorIframe, patterns } =
		usePmContext();

	// Pattern Data is forced into the empty block editor, which is why both blockEditorLoaded (step 1) and patternDataSet (step 2) need to exist.
	const [ blockEditorLoaded, setBlockEditorLoaded ] = useState( false );
	const [ patternDataSet, setPatternDataSet ] = useState( false );

	const nameTaken = ( newSlug: string ) => {
		return Object.values( patterns.data ).some( ( pattern ) => {
			return (
				pattern.slug === newSlug && currentPatternId.value !== newSlug
			);
		} );
	};

	const patternListenerCallbacks = ( event: MessageEvent< string > ) => {
		try {
			// Handle JSON messages here.
			const response: {
				message: string;
				blockPatternData?: Pattern;
				patternTitle?: string;
			} = JSON.parse( event.data );

			// When the pattern block editor tells us it has something new, put it into the pattern data.
			if ( response.message === 'patternmanager_block_pattern_updated' ) {
				patterns.set( {
					...patterns.data,
					[ currentPatternId.value ]: response.blockPatternData,
				} );
			}

			// Listening for input from pattern-post-type.
			if (
				response.message ===
					'pm_pattern_editor_request_is_pattern_title_taken' &&
				patternEditorIframe?.current
			) {
				const isTaken = nameTaken(
					convertToSlug( response.patternTitle )
				);
				const errorMessage = isTaken
					? __( 'This name is already taken.', 'pattern-manager' )
					: __( 'The name cannot be blank.', 'pattern-manager' );

				patternEditorIframe.current.contentWindow.postMessage(
					JSON.stringify( {
						message:
							'patternmanager_response_is_pattern_title_taken',
						isInvalid:
							isTaken || ! response.patternTitle.trim().length,
						errorMessage,
					} )
				);
			}
		} catch ( e ) {
			// Message posted was not JSON. Handle those here.
			switch ( event.data ) {
				case 'pm_pattern_editor_loaded':
					setBlockEditorLoaded( true );
					setInitialData( patternEditorIframe );
					break;
				case 'pm_pattern_data_set':
					// The iframed block editor will send a message to let us know when the pattern data has been inserted into the block editor.
					setPatternDataSet( true );
					break;
			}
		}
	};

	useEffect( () => {
		// The iframed block editor will send a message to let us know when it is ready.
		window.removeEventListener( 'message', patternListenerCallbacks );
		window.addEventListener( 'message', patternListenerCallbacks );

		setInitialData( patternEditorIframe );

		// Cleanup event listeners when this component is unmounted.
		return () => {
			window.removeEventListener( 'message', patternListenerCallbacks );
		};
	}, [ currentPatternId.value, patternEditorIframe ] );

	function setInitialData(
		iframeRef: MutableRefObject< HTMLIFrameElement >
	) {
		iframeRef?.current.contentWindow.postMessage(
			JSON.stringify( {
				message: 'set_initial_pattern_data',
				patternData: currentPattern,
			} )
		);
	}

	return (
		<div className="patternmanager-pattern-editor">
			<div className="patternmanager-pattern-editor-body">
				<div className="patternmanager-pattern-editor-view">
					{ ! patternDataSet ? (
						<div className="patternmanager-pattern-editor-loading-outer">
							<div className="patternmanager-pattern-editor-loading-inner">
								<Spinner />
								{ createInterpolateElement(
									__(
										'Loading blocks for <span></span> into block editor…',
										'pattern-manager'
									),
									{
										span: (
											<span>
												{ currentPattern.title }
											</span>
										),
									}
								) }
							</div>
						</div>
					) : null }
					<iframe
						title={ __( 'Pattern Editor', 'pattern-manager' ) }
						ref={ patternEditorIframe }
						hidden={ ! blockEditorLoaded }
						style={ {
							width: '100%',
							height: 'calc( 100vh - 64px )',
						} }
						src={
							patternManager.siteUrl +
							'/wp-admin/post-new.php?post_type=pm_pattern'
						}
					/>
				</div>
			</div>
		</div>
	);
}
