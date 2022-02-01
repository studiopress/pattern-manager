/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import {
	BlockEditorProvider,
	BlockList,
	WritingFlow,
	ObserveTyping,
	BlockEditorKeyboardShortcuts,
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

import { getPrefix } from './../non-visual/prefix.js';

import { registerCoreBlocks } from '@wordpress/block-library';
//registerCoreBlocks();

import {
	DropZoneProvider,
	SlotFillProvider,
	Slot,
	Popover,
	FormTokenField,
	Snackbar,
} from '@wordpress/components';
import { useContext, useState, useEffect, useRef } from '@wordpress/element';
import { GenesisStudioContext } from './../non-visual/non-visual-logic.js';
import { Modal } from './Modal.js';
import {
	testCollectionForErrors,
	testCollectionsForErrors,
} from './../non-visual/error-tests/error-tests.js';

const input_delay = [];

export function ThemeJsonEditor() {
	return <div>Hi there</div>;
}
export function ThemeJsonBlockEditor() {
	const {
		collections,
		frontendPreviewUrl,
		renderedBlockEndpoint,
	} = useContext( GenesisStudioContext );

	const [ patternAtMount, setPatternAtMount ] = useState(
		collections.currentPattern ? collections.currentPattern.key : null
	);
	const [ blocks, updateBlocks ] = useState(
		parse(
			collections.currentPattern && collections.currentPattern.content
				? collections.currentPattern.content
				: '<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->'
		)
	);
	const [ serializedBlocks, updateSerializedBlocks ] = useState(
		serialize( blocks )
	);
	const [ currentView, setCurrentView ] = useState( 'blockEditor' ); //Other option is "frontend"
	const [ editorWidth, setEditorWidth ] = useState( '100%' );
	const [ refreshFrontendIframe, setRefreshFrontendIframe ] = useState(
		false
	);
	let saveListener = null;

	function getEditorSettings() {
		const editorSettings = JSON.parse(
			JSON.stringify(
				wp.data.select( 'core/block-editor' ).getSettings()
			)
		);
		if (
			collections.currentCollection.collection_info.allowThemeColorPalette
		) {
			editorSettings.colors = genesisstudio.themeColorPallete;
		} else {
			editorSettings.colors = genesisstudio.disabledThemeColorPallete;
		}

		// Make media library work.
		editorSettings.mediaUploadCheck = MediaUploadCheck;
		editorSettings.mediaUpload = MediaUpload;
		editorSettings.mediaPlaceholder = MediaPlaceholder;
		editorSettings.mediaReplaceFlow = MediaReplaceFlow;

		return editorSettings;
	}

	function resetSaveListener() {
		//if ( saveListener ) { document.removeEventListener("keydown", saveListener, {once : true} ); }
		saveListener = document.addEventListener(
			'keydown',
			( event ) => {
				if ( event.keyCode == 83 && event.metaKey ) {
					saveCollectionToDisk();
				}
			},
			{ once: true }
		);
	}

	// on any change, reset the save listener
	useEffect( () => {
		//resetSaveListener();
	} );

	function getRenderedBlockHtml() {
		const postData = new FormData();
		postData.append( 'block_content', serializedBlocks );

		fetch( renderedBlockEndpoint, {
			method: 'POST',
			mode: 'same-origin',
			credentials: 'same-origin',
			body: postData,
		} )
			.then( function ( response ) {
				if ( response.status !== 200 ) {
					console.log(
						'Looks like there was a problem. Status Code: ' +
							response.status
					);

					return;
				}

				// Examine the text in the response
				response
					.json()
					.then( function ( data ) {
						console.log( data );
						const updatedPattern = JSON.parse(
							JSON.stringify( collections.currentPattern )
						);
						updatedPattern.previewHTML = data.renderedBlock;
						// Update the previewHTML of the pattern
						collections.setCurrentPattern( updatedPattern );
					} )
					.catch( function ( err ) {
						console.log( 'Fetch Error: ', err );
					} );
			} )
			.catch( function ( err ) {
				console.log( 'Fetch Error: ', err );
			} );
	}

	function applyClassNamesToTopLevelBlocks( blocks ) {
		//gpb-slate-section-hero-title
		const prefix = getPrefix(
			collections.currentCollection.collection_info.plugin
		);

		const className =
			prefix +
			'-' +
			collections.currentCollection.collection_info.slug +
			'-' +
			collections.currentPattern.type +
			'-' +
			collections.currentPattern.key
				.replaceAll(
					collections.currentCollection.collection_info.slug + '-',
					''
				)
				.replaceAll( '_', '-' );

		for ( const block in blocks ) {
			// Classnames that should persist and not be wiped out.
			const allowedClassNames = [ 'gb-layout-team-1' ];

			const additionalClassNames = '';

			// If the block contains one of the allowed class names, add it to the string of classnames to add at the end.
			for ( const classNameId in allowedClassNames ) {
				if (
					blocks[ block ].attributes.className &&
					blocks[ block ].attributes.className.includes(
						allowedClassNames[ classNameId ]
					)
				) {
					additionalClassNames =
						additionalClassNames +
						allowedClassNames[ classNameId ] +
						' ';
				}
			}

			blocks[ block ].attributes.className =
				className + ' ' + additionalClassNames;
		}

		return blocks;
	}

	useEffect( () => {
		if ( ! collections.currentPattern ) {
			return;
		}

		// Set up a delay which waits to bubble the value to gutenberg until .5 seconds after they stop typing or taking an action.
		if ( input_delay[ collections.currentPattern.key ] ) {
			// Clear the keypress delay if the user just typed
			clearTimeout( input_delay[ collections.currentPattern.key ] );
			input_delay[ collections.currentPattern.key ] = null;
		}

		// (Re)-Set up the save to fire in 500ms
		input_delay[ collections.currentPattern.key ] = setTimeout( () => {
			clearTimeout( input_delay[ collections.currentPattern.key ] );

			const newBlocks = applyClassNamesToTopLevelBlocks( blocks );
			// Store the serialized blocks (which is HTML) so that we can use it for the frontend previews.
			localStorage.setItem(
				'genesisstudio_current_blocks',
				serialize( newBlocks )
			);
			if ( wp && wp.data ) {
				wp.data
					.dispatch( 'core' )
					.saveEntityRecord( 'postType', 'genesisstudio', {
						id: genesisstudio.defaultPostId,
						content: serialize( newBlocks ),
					} )
					.then( () => {
						setRefreshFrontendIframe( true );
					} );
			}

			const updatedPattern = JSON.parse(
				JSON.stringify( collections.currentPattern )
			);
			updatedPattern.content = serialize( newBlocks );
			// Update the content of the pattern
			collections.setCurrentPattern( updatedPattern );

			updateSerializedBlocks( serialize( newBlocks ) );
			updateBlocks( newBlocks );
		}, 500 );
	}, [ blocks ] );

	useEffect( () => {
		if ( refreshFrontendIframe ) {
			setRefreshFrontendIframe( false );
			getRenderedBlockHtml();
		}
	}, [ refreshFrontendIframe ] );

	if ( ! collections.currentPattern ) {
		return 'Select a pattern to edit it here';
	}

	// If a different pattern is being loaded....
	if ( collections.currentPattern.key !== patternAtMount ) {
		updateBlocks( parse( collections.currentPattern.content ) );
		setPatternAtMount( collections.currentPattern.key );
	}

	function getViewToggleClassName( toggleInQuestion ) {
		if ( currentView === toggleInQuestion ) {
			return ' genesisstudio-active-tab';
		}

		return '';
	}

	function getFrontendPreviewUrl( screenshotMode ) {
		const prefix = getPrefix(
			collections.currentCollection.collection_info.plugin
		);

		const url = new URL( frontendPreviewUrl );

		if ( screenshotMode ) {
			url.searchParams.set( 'genesisstudio_blocks_only_page', true );
			url.searchParams.set(
				'title',
				prefix +
					'_' +
					collections.currentCollection.collection_info.slug +
					'_' +
					collections.currentPattern.type +
					'_' +
					collections.currentPattern.key
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
			url.searchParams.set( 'genesisstudio_blocks_only_page', true );
			url.searchParams.set( 'title', collections.currentPattern.key );
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
		<div className="genesisstudio-pattern-editor">
			<div className="genesisstudio-editor-header">
				<div className="genesisstudio-pattern-image">
					{ ( () => {
						if (
							collections.currentPattern.type === 'section' &&
							collections.currentPattern.previewHTML
						) {
							return (
								<SectionPreview
									bodyHTML={
										collections.currentPattern.previewHTML
									}
								/>
							);
						}
						return <img src={ collections.currentPattern.image } />;
					} )() }
				</div>
				<div className="genesisstudio-pattern-name">
					<h2>{ collections.currentPattern.name }</h2>
				</div>
				<div className="genesisstudio-pattern-tabs">
					<div
						className={
							'genesisstudio-tab' +
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
							'genesisstudio-tab' +
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
							'genesisstudio-tab' +
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
			<div className="genesisstudio-pattern-editor-body">
				<div
					className="genesisstudio-pattern-editor-view"
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
						{ __( 'Done Editing', 'genesisstudio' ) }
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
					className="genesisstudio-pattern-frontend-view"
					style={ {
						display: currentView === 'frontend' ? 'block' : 'none',
						width: editorWidth,
					} }
				>
					{ renderFrontendIframe() }
				</div>
				<div
					className="genesisstudio-pattern-editor-view"
					style={ {
						display:
							currentView === 'blockEditor' ? 'block' : 'none',
					} }
				>
					<SlotFillProvider>
						<DropZoneProvider>
							<BlockEditorProvider
								value={ blocks }
								onChange={ updateBlocks }
								onInput={ updateBlocks }
								settings={ getEditorSettings() }
							>
								<BlockEditorKeyboardShortcuts />
								<WritingFlow>
									<ObserveTyping>
										<Popover.Slot name="block-toolbar" />
										<div className="genesisstudio-pattern-editor-columns">
											<div className={ 'column' }>
												<div className="edit-post-visual-editor editor-styles-wrapper">
													<BlockList />
												</div>
												<div
													style={ {
														position: 'fixed',
														bottom: '0px',
														width: '100%',
														backgroundColor: '#fff',
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
							</BlockEditorProvider>
						</DropZoneProvider>
						<Popover.Slot />
					</SlotFillProvider>
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
	const { siteUrl } = useContext( GenesisStudioContext );
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
