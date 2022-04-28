import { v4 as uuidv4 } from 'uuid';

// WP Dependencies

// @ts-check
import { __ } from '@wordpress/i18n';
import { Modal, Spinner } from '@wordpress/components';
import { useState, useEffect, useRef, createInterpolateElement } from '@wordpress/element';

// Hooks
import useStudioContext from '../../hooks/useStudioContext';

// Components
import PatternPicker from '../PatternPicker';

// Utils
import searchItems from '../../utils/searchItems';

/** @param {{visible: boolean}} props */
export default function PatternEditor( { visible } ) {
	const { currentTheme, currentPatternId } = useStudioContext();
	const [ isPatternModalOpen, setIsPatternModalOpen ] = useState( false );

	return (
		<div hidden={ ! visible } className="fsestudio-pattern-work-area">
			{ isPatternModalOpen ? (
				<Modal
					title={ __(
						'Edit one of your existing patterns',
						'fse-studio'
					) }
					onRequestClose={ () => {
						setIsPatternModalOpen( false );
					} }
				>
					<PatternPicker
						patterns={ searchItems(
							Object.values( currentTheme.data.included_patterns ),
							'custom'
						) }
						onClickPattern={
							/** @param {string} clickedPatternId */
							( clickedPatternId ) => {
								currentPatternId.set( clickedPatternId );
								setIsPatternModalOpen( false );
							}
						}
					/>
				</Modal>
			) : null }

			{ currentPatternId.value ? <BlockEditor /> : null }
		</div>
	);
}

export function BlockEditor() {
	const { currentTheme, currentPattern, currentPatternId } = useStudioContext();
	const [ currentPatternName, setCurrentPatternName ] = useState();
	const [ blockEditorLoaded, setBlockEditorLoaded ] = useState( false );
	const iframeRef = useRef();
	useEffect( () => {
		saveAndRefreshPatternIframe();
	}, [ currentTheme.hasSaved ] );

	function saveAndRefreshPatternIframe() {
		setBlockEditorLoaded( false );
		// Send a message to the iframe, telling it to save and refresh.
		iframeRef.current.contentWindow.postMessage(
			// It might be better to try updating the editor settings, but this apears to be broken.
			// See: https://github.com/WordPress/gutenberg/issues/15993
			JSON.stringify( {
				message: 'fsestudio_save_and_refresh',
			} )
		);
	}

	useEffect( () => {
		// The iframed block editor will send a message to let us know when it is ready.
		window.addEventListener(
			'message',
			( event ) => {
				switch ( event.data ) {
					case 'fsestudio_pattern_editor_loaded':
						setBlockEditorLoaded( true );
				}
			},
			false
		);

		// The iframes block editor will send a message whenever the pattern is saved.
		window.addEventListener(
			'message',
			( event ) => {
				try {
					const response = JSON.parse( event.data );
					if ( response.message === 'fsestudio_pattern_saved' ) {
						// Fighting a race condition here, where the post hasn't actually finished saving yet, despite wp.data telling us it has.
						// When a pattern is saved, ping the server to get the updated theme state.
						currentTheme.get();
					}
				} catch ( e ) {
					// Message posted was not JSON, so do nothing.
				}
			},
			false
		);

		// As a fallback, if 5 seconds have passed, hide the spinner.
		setTimeout( () => {
			setBlockEditorLoaded( true );
		}, 5000 );
	}, [] );

	useEffect( () => {
		if ( currentPatternId.value !== currentPatternName ) {
			setBlockEditorLoaded( false );
		}
		setCurrentPatternName( currentPatternId.value );
	}, [ currentPatternId ] );

	return (
		<div className="fsestudio-pattern-editor">
			<div className="fsestudio-pattern-editor-body">
				<div className="fsestudio-pattern-editor-view">
					{ ! blockEditorLoaded ? (
						<div>
							<Spinner />
							{ createInterpolateElement(
							__(
								'Loading blocks for <span></span> into block editor...',
								'fse-studio'
							),
							{
								span: <span>{currentPattern.title}</span>
							}
							)}
						</div>
					) : null }
					<iframe
						title={ __( 'Pattern Editor', 'fse-studio' ) }
						ref={ iframeRef }
						hidden={ ! blockEditorLoaded }
						style={ {
							width: '100%',
							height: 'calc( 100vh - 64px )',
						} }
						src={ fsestudio.siteUrl + '?fsestudio_pattern_post=' + encodeURIComponent( JSON.stringify( currentPattern ) ) }
					/>
				</div>
			</div>
		</div>
	);
}
