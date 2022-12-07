/* eslint-disable no-undef */

import React from 'react';

import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import {
	useState,
	useEffect,
	createInterpolateElement,
} from '@wordpress/element';

// Hooks
import useStudioContext from '../../hooks/useStudioContext';

// Globals
import { fsestudio } from '../../globals';

// Utils
import convertToSlug from '../../utils/convertToSlug';

type Props = {
	visible: boolean;
};

export default function PatternEditor( { visible }: Props ) {
	const { currentPatternId } = useStudioContext();

	return (
		<div hidden={ ! visible } className="fsestudio-pattern-work-area">
			{ currentPatternId?.value ? <BlockEditor /> : null }
		</div>
	);
}

export function BlockEditor() {
	const {
		currentPattern,
		currentPatternId,
		patternEditorIframe,
		currentTheme,
	} = useStudioContext();

	// Pattern Data is forced into the empty block editor, which is why both blockEditorLoaded (step 1) and patternDataSet (step 2) need to exist.
	const [ blockEditorLoaded, setBlockEditorLoaded ] = useState( false );
	const [ patternDataSet, setPatternDataSet ] = useState( false );

	const nameTaken = ( newSlug: string ) => {
		return Object.values( currentTheme?.data.included_patterns ).some(
			( pattern ) => {
				return (
					pattern.slug === newSlug &&
					currentPatternId?.value !== newSlug
				);
			}
		);
	};

	const patternListenerCallbacks = ( event: MessageEvent< string > ) => {
		try {
			// Handle JSON messages here.
			const response: {
				message: string;
				blockPatternData?: string;
				patternTitle?: string;
			} = JSON.parse( event.data );

			// When the pattern block editor tells us it has something new, put it into the theme's pattern data (included_patterns).
			if ( response.message === 'fsestudio_block_pattern_updated' ) {
				currentTheme?.set( {
					...currentTheme.data,
					included_patterns: {
						...currentTheme.data.included_patterns,
						[ currentPatternId.value ]: response.blockPatternData,
					},
				} );
			}

			// Listening for input from pattern-post-type.
			if (
				response.message ===
					'fsestudio_pattern_editor_request_is_pattern_title_taken' &&
				patternEditorIframe?.current
			) {
				const isTaken = nameTaken(
					convertToSlug( response.patternTitle )
				);
				const errorMessage = isTaken
					? __( 'This name is already taken.', 'fse-studio' )
					: __( 'The name cannot be blank.', 'fse-studio' );

				patternEditorIframe.current.contentWindow.postMessage(
					JSON.stringify( {
						message: 'fsestudio_response_is_pattern_title_taken',
						isInvalid:
							isTaken || ! response.patternTitle.trim().length,
						errorMessage,
					} )
				);
			}
		} catch ( e ) {
			// Message posted was not JSON. Handle those here.
			switch ( event.data ) {
				case 'fsestudio_pattern_editor_loaded':
					setBlockEditorLoaded( true );
					setInitialData( patternEditorIframe );
					break;
				case 'fsestudio_pattern_data_set':
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
	}, [ currentPatternId?.value, patternEditorIframe ] );

	function setInitialData(
		iframeRef: React.MutableRefObject< HTMLIFrameElement >
	) {
		iframeRef?.current.contentWindow.postMessage(
			JSON.stringify( {
				message: 'set_initial_pattern_data',
				patternData: currentPattern,
			} )
		);
	}

	return (
		<div className="fsestudio-pattern-editor">
			<div className="fsestudio-pattern-editor-body">
				<div className="fsestudio-pattern-editor-view">
					{ ! patternDataSet ? (
						<div className="h-screen min-h-full w-screen items-center justify-center">
							<div className="flex justify-center h-screen min-h-full w-full mx-auto items-center">
								<Spinner />
								{ createInterpolateElement(
									__(
										'Loading blocks for <span></span> into block editor…',
										'fse-studio'
									),
									{
										span: (
											<span className="px-1 font-semibold">
												{ currentPattern?.title }
											</span>
										),
									}
								) }
							</div>
						</div>
					) : null }
					<iframe
						title={ __( 'Pattern Editor', 'fse-studio' ) }
						ref={ patternEditorIframe }
						hidden={ ! blockEditorLoaded }
						style={ {
							width: '100%',
							height: 'calc( 100vh - 64px )',
						} }
						src={
							fsestudio.siteUrl +
							'/wp-admin/post-new.php?post_type=fsestudio_pattern'
						}
					/>
				</div>
			</div>
		</div>
	);
}
