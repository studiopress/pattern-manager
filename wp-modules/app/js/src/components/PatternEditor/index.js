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
	const { patterns, currentThemeJsonFile, currentTheme } = useStudioContext();
	const [ currentPatternId, setCurrentPatternId ] = useState( '' );
	const pattern = usePatternData(
		currentPatternId,
		patterns,
		currentThemeJsonFile,
		currentTheme
	);

	const [ isPatternModalOpen, setIsPatternModalOpen ] = useState( false );

	function renderBrowsePatternsButton() {
		return (
			<button
				type="button"
				className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
				onClick={ () => {
					setIsPatternModalOpen( true );
				} }
			>
				<Icon
					className="text-white fill-current mr-2"
					icon={ layout }
					size={ 26 }
				/>{ ' ' }
				{ __( 'Edit Patterns', 'fse-studio' ) }
			</button>
		);
	}

	return (
		<div hidden={ ! visible } className="fsestudio-pattern-work-area">
			<div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
				<div className="flex-1 flex">
					<div className="flex w-full p-3 gap-5">
						{ renderBrowsePatternsButton() }
						<button
							type="button"
							className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => {
								const newPatternId = uuidv4();

								const newPatternData = {
									type: 'custom',
									title: 'My New Pattern',
									name: newPatternId,
									categories: [],
									viewportWidth: '',
									content: '',
								};

								patterns
									.createNewPattern( newPatternData )
									.then( () => {
										// Switch to the newly created theme.
										setCurrentPatternId( newPatternId );
									} );
							} }
						>
							{ __( 'Create a new pattern', 'fse-studio' ) }
						</button>
					</div>
				</div>
			</div>
			{ pattern.data ? null : (
				<div className="max-w-7xl mx-auto bg-white mt-20 shadow">
					<h1 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">
						{ __( 'Pattern Editor', 'fse-studio' ) }
					</h1>
					<div className="px-4 sm:px-6 md:px-8 py-8 flex flex-row gap-14 items-center">
						<p className="text-base mb-4 max-w-3xl">
							{ __(
								'Welcome to the Pattern Editor! Here, you can create and edit patterns for your site. Browse your patterns by clicking the Edit Patterns button to the right, or by using the Edit Patterns button in the header.',
								'fse-studio'
							) }
						</p>
						<div className="bg-[#f8f8f8] p-20 w-full text-center">
							{ renderBrowsePatternsButton() }
						</div>
					</div>
				</div>
			) }
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
						themeJsonData={ currentThemeJsonFile.data }
						onClickPattern={
							/** @param {string} clickedPatternId */
							( clickedPatternId ) => {
								setCurrentPatternId( clickedPatternId );
								setIsPatternModalOpen( false );
							}
						}
					/>
				</Modal>
			) : null }

			{ pattern.data ? <BlockEditor pattern={ pattern } /> : null }
		</div>
	);
}

export function BlockEditor( { pattern } ) {
	const { currentThemeJsonFile } = useStudioContext();
	const [ currentPatternName, setCurrentPatternName ] = useState();
	const [ blockEditorLoaded, setBlockEditorLoaded ] = useState( false );
	const iframeRef = useRef();
	useEffect( () => {
		saveAndRefreshPatternIframe();
	}, [ currentThemeJsonFile.hasSaved ] );

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
						pattern.set( {
							...pattern.data,
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
		if ( pattern.data.name !== currentPatternName ) {
			setBlockEditorLoaded( false );
			// As a fallback, if 5 seconds have passed, hide the spinner.
			setTimeout( () => {
				setBlockEditorLoaded( true );
			}, 5000 );
		}
		setCurrentPatternName( pattern.data.name );
	}, [ pattern ] );

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
						src={ pattern.data.block_editor_url }
					/>
				</div>
			</div>
		</div>
	);
}
