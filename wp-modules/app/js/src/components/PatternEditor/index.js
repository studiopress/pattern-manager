// WP Dependencies

// @ts-check
import { __ } from '@wordpress/i18n';
import { Modal, Spinner } from '@wordpress/components';
import {
	useState,
	useEffect,
	createInterpolateElement,
} from '@wordpress/element';

// Hooks
import useStudioContext from '../../hooks/useStudioContext';

// Globals
import { fsestudio } from '../../globals';

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
							Object.values(
								currentTheme.data.included_patterns ?? {}
							),
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
	const {
		currentPattern,
		currentPatternId,
		patternEditorIframe,
		currentTheme,
	} = useStudioContext();
	const [ currentPatternName, setCurrentPatternName ] = useState();
	
	// Pattern Data is forced into the empty block editor, which is why both blockEditorLoaded (step 1) and patternDataSet (step 2) need to exist.
	const [ blockEditorLoaded, setBlockEditorLoaded ] = useState(false);
	const [ patternDataSet, setPatternDataSet ] = useState(false);

	useEffect( () => {
		// The iframed block editor will send a message to let us know when it is ready.
		window.addEventListener(
			'message',
			( event ) => {
				switch ( event.data ) {
					case 'fsestudio_pattern_editor_loaded':
						setBlockEditorLoaded( true );
					case 'fsestudio_pattern_data_set':
						// The iframed block editor will send a message to let us know when the pattern data has been inserted into the block editor.
						setPatternDataSet( true );
				}
			},
			false
		);
		
		window.addEventListener(
			'message',
			( event ) => {
				try {
					const response = JSON.parse( event.data );
					
					// When the pattern block editor tells us it has something new, put it into the theme's pattern data (included_patterns).
					if ( response.message === 'fsestudio_block_pattern_updated' ) {
						const newThemeData = {
							...currentTheme.data,
							included_patterns: {
								...currentTheme.data.included_patterns,
								[currentPatternId.value]: response.blockPatternData,
							}
						}	
						currentTheme.set(newThemeData);
					}
				} catch ( e ) {
					// Message posted was not JSON, so do nothing.
				}
			}
		);

	}, [] );

	useEffect( () => {
		if ( currentPatternId.value !== currentPatternName ) {
			setBlockEditorLoaded( false );
			setPatternDataSet( false );
		}
		setCurrentPatternName( currentPatternId.value );
	}, [ currentPatternId ] );
	
	useEffect( () => {
		if ( blockEditorLoaded ) {
			// Upon initial load, fill block editor with blocks.
			patternEditorIframe.current.contentWindow.postMessage(
				JSON.stringify( {
					message: 'set_initial_pattern_data',
					patternData: currentPattern,
				} ),
			);
		}
	}, [blockEditorLoaded] );

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
												{ currentPattern.title }
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
