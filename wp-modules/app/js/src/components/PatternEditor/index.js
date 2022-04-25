import { v4 as uuidv4 } from 'uuid';

// WP Dependencies

// @ts-check
import { __ } from '@wordpress/i18n';
import { Icon, layout } from '@wordpress/icons';
import { Modal, Spinner } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';

// Hooks
import usePatternData from '../../hooks/usePatternData';
import useStudioContext from '../../hooks/useStudioContext';

// Components
import PatternPicker from '../PatternPicker';

// Utils
import searchItems from '../../utils/searchItems';

/** @param {{visible: boolean}} props */
export default function PatternEditor( { visible } ) {
	const { currentView, patterns, currentTheme, currentPatternId, currentPattern } = useStudioContext();
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
							Object.values( patterns.patterns ),
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

			{ currentPattern.data ? <BlockEditor /> : null }
		</div>
	);
}

export function BlockEditor() {
	const { currentTheme, currentPattern } = useStudioContext();
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
						// When a pattern is saved, push its new data into our pattern state so that it is up to date in thumbnails, etc.
						currentPattern.set( {
							...currentPattern.data,
							title: response.blockPatternData.title,
							content: response.blockPatternData.content,
							type: response.blockPatternData.type,
						} );
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
		if ( currentPattern.data.name !== currentPatternName ) {
			setBlockEditorLoaded( false );
		}
		setCurrentPatternName( currentPattern.data.name );
	}, [ currentPattern ] );

	return (
		<div className="fsestudio-pattern-editor">
			<div className="fsestudio-pattern-editor-body">
				<div className="fsestudio-pattern-editor-view">
					{ ! blockEditorLoaded ? (
						<div>
							<Spinner />
							Getting the latest version of this Pattern into the
							block Editor...
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
						src={ currentPattern.data.block_editor_url }
					/>
				</div>
			</div>
		</div>
	);
}
