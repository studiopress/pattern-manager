/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import {
	BlockEditorProvider,
	BlockList,
	BlockTools,
	WritingFlow,
	ObserveTyping,
	storeConfig as blockEditorStoreConfig,
	BlockInspector,
	BlockBreadcrumb,
	MediaUpload,
	MediaUploadCheck,
	MediaPlaceholder,
	MediaReplaceFlow,
} from '@wordpress/block-editor';

import { useDispatch, useCallback } from '@wordpress/data';

import { serialize, parse } from '@wordpress/blocks';

//import { parse } from '@wordpress/block-serialization-default-parser';

import { getPrefix } from './../non-visual/prefix.js';

import { registerCoreBlocks } from '@wordpress/block-library';
//registerCoreBlocks();

import {
	DropZoneProvider,
	SlotFillProvider,
	Slot,
	Popover,
	Modal,
	FormTokenField,
	Snackbar,
} from '@wordpress/components';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import { useContext, useState, useEffect, useRef } from '@wordpress/element';
import {
	FseStudioContext,
	usePatternData,
} from './../non-visual/non-visual-logic.js';
import { testPatternForErrors } from './../non-visual/error-tests/error-tests.js';

const input_delay = [];

// import '@wordpress/components/build-style/style.css';
// import '@wordpress/block-editor/build-style/style.css';

export function PatternEditorApp( props ) {
	const { patterns } = useContext( FseStudioContext );
	const [ currentPatternId, setCurrentPatternId ] = useState();
	const pattern = usePatternData( currentPatternId );
	const [ errors, setErrors ] = useState( false );
	const [ errorModalOpen, setErrorModalOpen ] = useState( false );

	function renderPatternSelector() {
		const renderedPatterns = [];

		renderedPatterns.push(
			<option key={ 1 }>
				{ __( 'Choose a pattern', 'fse-studio' ) }
			</option>
		);

		let counter = 3;

		for ( const pattern in patterns.patterns ) {
			const patternInQuestion = patterns.patterns[ pattern ];
			renderedPatterns.push(
				<option key={ counter } value={ pattern }>
					{ patternInQuestion.title }
				</option>
			);
			counter++;
		}

		return (
			<>
				<select
					value={ currentPatternId }
					onChange={ ( event ) => {
						setCurrentPatternId( event.target.value );
					} }
				>
					{ renderedPatterns }
				</select>
			</>
		);
	}

	function renderPatternEditorWhenReady() {
		if ( pattern.data ) {
			return (
				<PatternEditor pattern={ pattern } setErrors={ setErrors } />
			);
		}
		return '';
	}

	function formatErrorMessage( testResult ) {
		const output = [];
		let counter = 0;
		for ( const error in testResult.errors ) {
			counter++;
			const errorTitle = testResult.errors[ error ].errorTitle;
			const errorMessage = testResult.errors[ error ].errorMessage;
			const block = testResult.errors[ error ].block;
			const invalidValue =
				'Invalid Value: ' + testResult.errors[ error ].invalidValue;
			output.push(
				<div key={ counter }>
					<h2>Error: { errorTitle }</h2>
					<h2>{ errorMessage }</h2>
					<h4>Pattern: { testResult.pattern }</h4>
					<p>Block: { block.name }</p>
					<p>{ invalidValue }</p>
				</div>
			);
		}

		return output;
	}

	function maybeRenderErrors() {
		if ( errors && ! errors?.success ) {
			console.log( errors );
			return (
				<div>
					<span>Errors </span>
					<button
						onClick={ () => {
							setErrorModalOpen( true );
						} }
					>
						{ Object.keys( errors?.errors ).length }
					</button>
					{ ( () => {
						if ( errorModalOpen ) {
							return (
								<Modal
									title={ __(
										'Errors in pattern',
										'fse-studio'
									) }
									onRequestClose={ () =>
										setErrorModalOpen( false )
									}
								>
									{ formatErrorMessage( errors ) }
								</Modal>
							);
						}
					} )() }
				</div>
			);
		}
		return '';
	}

	return (
		<div className="fsestudio-pattern-work-area">
			<div className="fsestudio-subheader">
				<div>Pattern Editor</div>
				{ renderPatternSelector() }
				{ maybeRenderErrors() }
			</div>
			{ renderPatternEditorWhenReady() }
		</div>
	);
}

export function PatternEditor( props ) {
	const pattern = props.pattern;

	const [ blocks, updateBlocks ] = useState( [
		parseBlocks(
			pattern?.data?.content
				? pattern?.data?.content
				: '<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->'
		),
	] );

	const [ serializedBlocks, updateSerializedBlocks ] = useState();

	const [ currentView, setCurrentView ] = useState( 'blockEditor' ); //Other option is "frontend"
	const [ editorWidth, setEditorWidth ] = useState( '100%' );
	const [ refreshFrontendIframe, setRefreshFrontendIframe ] = useState(
		false
	);
	const saveListener = null;

	useEffect( () => {
		// If the pattern prop changes to a new pattern, reset the blocks in the editor to be that pattern's blocks.
		updateBlocks(
			parse(
				pattern?.data?.content
					? pattern?.data?.content
					: '<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->'
			)
		);
		props.setErrors( false );
	}, [ pattern?.data?.name ] );

	// When blocks are changed in the block editor, update them in their corresponding files as well.
	useEffect( () => {
		console.log( 'Blocks', blocks );

		props.setErrors( testPatternForErrors( blocks ) );

		pattern.set( {
			...pattern.data,
			content: serialize( blocks[ 0 ] ),
		} );
	}, [ blocks ] );

	function getEditorSettings() {
		const editorSettings = JSON.parse(
			JSON.stringify(
				wp.data.select( 'core/block-editor' ).getSettings()
			)
		);

		// Make media library work.
		editorSettings.mediaUploadCheck = MediaUploadCheck;
		editorSettings.mediaUpload = MediaUpload;
		editorSettings.mediaPlaceholder = MediaPlaceholder;
		editorSettings.mediaReplaceFlow = MediaReplaceFlow;

		return editorSettings;
	}

	if ( ! pattern.data ) {
		return 'Select a pattern to edit it here';
	}

	function getViewToggleClassName( toggleInQuestion ) {
		if ( currentView === toggleInQuestion ) {
			return ' fsestudio-active-tab';
		}

		return '';
	}

	function getFrontendPreviewUrl( screenshotMode ) {
		return '';
		const prefix = getPrefix(
			collections.currentCollection.collection_info.plugin
		);

		const url = new URL( frontendPreviewUrl );

		if ( screenshotMode ) {
			url.searchParams.set( 'fsestudio_blocks_only_page', true );
			url.searchParams.set(
				'title',
				prefix +
					'_' +
					collections.currentCollection.collection_info.slug +
					'_' +
					pattern.data.type +
					'_' +
					pattern.data.key
						.replaceAll(
							collections.currentCollection.collection_info.slug +
								'-',
							''
						)
						.replaceAll( '-', '_' )
			);
			url.searchParams.set( 'screenshot_mode', 1 );
			return url.toString();
		}
		if ( currentView === 'blockEditor' ) {
			return '';
		}
		if ( currentView === 'frontend' ) {
			url.searchParams.set( 'fsestudio_blocks_only_page', true );
			url.searchParams.set( 'title', pattern.data.key );
			return url.toString();
		}
	}

	function renderFrontendIframe() {
		if ( refreshFrontendIframe ) {
			return 'Refreshing...';
		}
		return (
			<iframe
				src={ getFrontendPreviewUrl( false ) }
				style={ { width: '100%' } }
			/>
		);
	}

	return (
		<div className="fsestudio-pattern-editor">
			<div
				style={ { display: 'none' } }
				className="fsestudio-editor-header"
			>
				<div className="fsestudio-pattern-image"></div>
				<div className="fsestudio-pattern-name">
					<h2>{ pattern.data.name }</h2>
				</div>
				<div className="fsestudio-pattern-tabs">
					<div
						className={
							'fsestudio-tab' +
							getViewToggleClassName( 'blockEditor' )
						}
						onClick={ () => {
							setCurrentView( 'blockEditor' );
						} }
					>
						Block Editor
					</div>
					<div
						className={
							'fsestudio-tab' +
							getViewToggleClassName( 'codeEditor' )
						}
						onClick={ () => {
							setCurrentView( 'codeEditor' );
						} }
					>
						Code Editor
					</div>
					<div
						className={
							'fsestudio-tab' +
							getViewToggleClassName( 'frontend' )
						}
						onClick={ () => {
							setCurrentView( 'frontend' );
						} }
					>
						Frontend Preview
					</div>
					<select
						onChange={ ( event ) => {
							setEditorWidth( event.target.value );
						} }
					>
						<option value={ '100%' }>Desktop</option>
						<option value={ '320px' }>320px (iPhone 5/SE)</option>
						<option value={ '375px' }>375px (iPhone X)</option>
						<option value={ '768px' }>768px (iPad)</option>
						<option value={ '1024px' }>1024px (iPad Pro)</option>
					</select>
				</div>
			</div>
			<div className="fsestudio-pattern-editor-body">
				<div
					className="fsestudio-pattern-editor-view"
					style={ {
						display:
							currentView === 'codeEditor' ? 'block' : 'none',
					} }
				>
					<button
						className="button"
						onClick={ () => {
							try {
								parse( serializedBlocks );
							} catch ( error ) {
								alert(
									'Invalid block content. Please check your code to make sure it is valid.'
								);
								return;
							}

							updateBlocks( parse( serializedBlocks ) );
						} }
					>
						{ __( 'Done Editing', 'fse-studio' ) }
					</button>
					<textarea
						style={ {
							width: '100%',
							height: '90%',
						} }
						value={ serializedBlocks }
						onChange={ ( event ) => {
							updateSerializedBlocks( event.target.value );
						} }
					/>
				</div>
				<div
					className="fsestudio-pattern-frontend-view"
					style={ {
						display: currentView === 'frontend' ? 'block' : 'none',
						width: editorWidth,
					} }
				>
					{ renderFrontendIframe() }
				</div>
				<div
					className="fsestudio-pattern-editor-view"
					style={ {
						display:
							currentView === 'blockEditor' ? 'block' : 'none',
					} }
				>
					<ShortcutProvider>
						<BlockEditorProvider
							value={ blocks }
							onChange={ updateBlocks }
							onInput={ updateBlocks }
							settings={ getEditorSettings() }
						>
							<SlotFillProvider>
								<BlockTools>
									<WritingFlow>
										<ObserveTyping>
											<div className="fsestudio-pattern-editor-columns">
												<div className={ 'column' }>
													<div className="edit-post-visual-editor editor-styles-wrapper">
														<BlockList />
													</div>
													<div
														style={ {
															position: 'fixed',
															bottom: '0px',
															width: '100%',
															backgroundColor:
																'#fff',
															padding: '4px',
															zIndex: '999',
														} }
													>
														<BlockBreadcrumb />
													</div>
												</div>
												<div className={ 'column' }>
													<BlockInspector />
												</div>
											</div>
										</ObserveTyping>
									</WritingFlow>
								</BlockTools>
							</SlotFillProvider>
						</BlockEditorProvider>
						<Popover.Slot />
					</ShortcutProvider>
				</div>
			</div>
		</div>
	);
}

function openScreenshot( url, type = 'section' ) {
	if ( type === 'section' ) {
		// Scaled up version of 600 by 422 - to a factor of 2.25
		window.open(
			url,
			'targetWindow',
			`toolbar=no,
		    location=no,
		    status=no,
		    menubar=no,
		    scrollbars=yes,
		    resizable=no,
		    width=1350,
		    height=949.5`
		);
	}

	if ( type === 'layout' ) {
		// Scaled up version of 600 by 679 - to a factor of 2.25
		window.open(
			url,
			'targetWindow',
			`toolbar=no,
		    location=no,
		    status=no,
		    menubar=no,
		    scrollbars=yes,
		    resizable=no,
		    width=1350,
		    height=1527.75`
		);
	}
}

function SectionPreview( props ) {
	const { siteUrl } = useContext( FseStudioContext );
	const iframeRef = useRef( null );
	const [ iframeInnerContentHeight, setIframeInnerContentHeight ] = useState(
		0
	);

	function renderLayoutHtmlForIframe( bodyHTML ) {
		return (
			`<html>
			<head>
				<link rel="stylesheet" id="wp-block-library-css" href="` +
			siteUrl +
			`/wp-includes/css/dist/block-library/style.min.css" media="all">
				<link rel="stylesheet" id="wp-block-library-theme-css" href="` +
			siteUrl +
			`/wp-includes/css/dist/block-library/theme.min.css?ver=5.6" media="all">
				<link rel="stylesheet" id="genesis-blocks-style-css-css" href="https://developer.wpengine.com/slate/wp-content/plugins/genesis-page-builder/lib/genesis-blocks/dist/blocks.style.build.css?ver=1613169060" media="all">
				<link rel="stylesheet" id="genesis-page-builder-frontend-styles-css" href="https://developer.wpengine.com/slate/wp-content/plugins/genesis-page-builder/build/frontend.styles.build.css?ver=1613169060" media="all">
				<link rel="stylesheet" id="genesis-block-theme-style-css" href="https://developer.wpengine.com/slate/wp-content/themes/genesis-block-theme/style.css?ver=5.6" type="text/css" media="all">
				<style type="text/css">
					.gb-layout-columns-1 > .gb-layout-column-wrap {
						width:100%;
					}
				</style>
			</head>
			<body class="wp-embed-responsive">` +
			bodyHTML +
			`</body>
			<script type="text/javascript">
				if ( document.body.scrollHeight < 1097 ){
					addcsstohead(\`
					body > *:first-child {
						position: absolute!important;
						height: 100%!important;
						top: 0px!important;
						bottom: 0px!important;
						left: 0px!important;
						right: 0px!important;
						display: grid!important;
						align-items: center!important;
					}
					\`);
				}
				
				function addcsstohead(css){
					console.log('addingcss to head');
					var head = document.getElementsByTagName('head')[0];
					var s = document.createElement('style');
					s.setAttribute('type', 'text/css');
					if (s.styleSheet) {   // IE
					    s.styleSheet.cssText = css;
					} else {                // the world
					    s.appendChild(document.createTextNode(css));
					}
					head.appendChild(s);
				  }
			</script>
		</html>`
		);
	}

	function onLoad() {
		console.log(
			iframeRef.current.contentWindow.document.body.scrollHeight
		);
		setIframeInnerContentHeight(
			iframeRef.current.contentWindow.document.body.scrollHeight
		);
	}

	return (
		<div
			style={ {
				width: '75px', // Scaled down version of 600 by 422 - to a factor of .125
				height: '52.75px', // Scaled down version of 600 by 422 - to a factor of .125
			} }
		>
			<iframe
				ref={ iframeRef }
				onLoad={ onLoad }
				scrolling="no"
				style={ {
					width: '1560px', // Scaled up version of 600 by 422 - to a factor of 2.6
					height: '1097px', // Scaled up version of 600 by 422 - to a factor of 2.6
					transform: 'scale(.048)',
					transformOrigin: '0 0',
					overflow: 'hidden',
					top: '0px',
					borderRadius: '5px',
				} }
				srcDoc={ renderLayoutHtmlForIframe( props.bodyHTML ) }
				src={
					'data:text/html;charset=utf-8,' +
					escape( renderLayoutHtmlForIframe( props.bodyHTML ) )
				}
			/>
		</div>
	);
}

function parseBlocks( blocksToParse ) {
	if ( parse( blocksToParse ) ) {
		return parse( blocksToParse );
	}
	console.log(
		'Invalid block content. Unable to parse.',
		blocksToParse,
		parse( blocksToParse )
	);
	return parse( blocksToParse );
}
