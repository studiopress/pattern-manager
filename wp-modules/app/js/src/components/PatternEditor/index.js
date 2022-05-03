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
	const { currentPattern, currentPatternId, patternEditorIframe, blockEditorLoaded, setBlockEditorLoaded } = useStudioContext();
	const [ currentPatternName, setCurrentPatternName ] = useState();

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
						<div className="h-screen min-h-full w-screen items-center justify-center">
							<div className="flex justify-center h-screen min-h-full w-full mx-auto items-center">
								<Spinner />
								{ createInterpolateElement(
								__(
									'Loading blocks for <span></span> into block editor...',
									'fse-studio'
								),
								{
									span: <span className="px-1 font-semibold">{currentPattern.title}</span>
								}
								)}
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
						src={ fsestudio.siteUrl + '/wp-admin/post.php?post=' + currentPattern.post_id + '&action=edit' }
					/>
				</div>
			</div>
		</div>
	);
}
