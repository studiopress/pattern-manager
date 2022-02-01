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
	BlockPreview,
} from '@wordpress/block-editor';
import { useDispatch, useCallback } from '@wordpress/data';

import { serialize, parse } from '@wordpress/blocks';

import { getPrefix } from './../non-visual/prefix.js';

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

export function LayoutEditor() {
	const { collections } = useContext( GenesisStudioContext );
	console.log( collections.currentPattern.section_keys );

	useEffect( () => {
		//setLayoutSections();
	}, [] );

	function setLayoutSections( newLayoutSections ) {
		if ( ! collections.currentPattern ) {
			return;
		}

		const reformattedLayoutSections = [];

		for ( const section in newLayoutSections ) {
			// Reformat the keys in this pattern just in case.
			const prefix = getPrefix(
				collections.currentCollection.collection_info.plugin
			);
			const reformattedKey = newLayoutSections[ section ]
				.replaceAll( prefix + '_', '' )
				.replaceAll( 'section_', '' )
				.replaceAll( '_', '-' );

			// Make sure this section actually exists (might have been renamed).
			if ( collections.currentCollection.patterns[ reformattedKey ] ) {
				reformattedLayoutSections.push( reformattedKey );
			}
		}

		const updatedPattern = JSON.parse(
			JSON.stringify( collections.currentPattern )
		);
		updatedPattern.section_keys = reformattedLayoutSections;

		// Update the section_keys of the pattern
		collections.setCurrentPattern( updatedPattern );
	}

	function renderPatternPreviews() {
		if ( ! collections.currentCollection ) {
			return;
		}
		const mapper = [];

		let counter = 1;
		for ( const pattern in collections.currentCollection.patterns ) {
			const patternInQuestion =
				collections.currentCollection.patterns[ pattern ];

			if (
				collections.currentCollection.patterns[ pattern ].type !==
				'section'
			) {
				continue;
			}
			mapper.push(
				<button
					key={ counter }
					className={
						'genesisstudio-layout-editor-add-pattern-button'
					}
					onClick={ () => {
						const newLayoutSections = JSON.parse(
							JSON.stringify(
								collections.currentPattern.section_keys
							)
						);
						newLayoutSections.push( patternInQuestion.key );
						setLayoutSections( newLayoutSections );
					} }
				>
					{ collections.currentCollection.patterns[ pattern ].name }
				</button>
			);
			counter++;
		}

		return mapper;
	}

	function renderLayout() {
		const mapper = [];
		let counter = 1;

		for ( const pattern in collections.currentPattern.section_keys ) {
			const prefix = getPrefix(
				collections.currentCollection.collection_info.plugin
			);
			const reformattedKey = collections.currentPattern.section_keys[
				pattern
			]
				.replaceAll( prefix + '_', '' )
				.replaceAll( 'section_', '' )
				.replaceAll( '_', '-' );
			const patternInQuestion =
				collections.currentCollection.patterns[ reformattedKey ];

			if ( ! patternInQuestion ) {
				continue;
			}

			mapper.push(
				<div
					key={ counter }
					className="genesisstudio-layout-editor-section-container"
					style={ {
						position: 'relative',
						overflow: 'hidden',
					} }
				>
					<button
						onClick={ () => {
							const newLayoutSections = JSON.parse(
								JSON.stringify(
									collections.currentPattern.section_keys
								)
							);
							newLayoutSections.splice( pattern, 1 );
							setLayoutSections( newLayoutSections );
						} }
						style={ {
							position: 'absolute',
							top: '0px',
							right: '0px',
							zIndex: '1',
						} }
					>
						Remove Section
					</button>
					<LayoutPreview bodyHTML={ patternInQuestion.content } />
				</div>
			);
			counter++;
		}

		return mapper;
	}

	return (
		<div className="genesisstudio-layout-editor">
			<div className="genesisstudio-layout-editor-columns">
				<div className={ 'column' }>
					<div className="genesisstudio-sections-in-collection">
						{ renderPatternPreviews() }
					</div>
				</div>
				<div
					className={ 'column' }
					className="genesisstudio-layout-preview-column"
				>
					<div
						className="genesisstudio-layout"
						style={ { overflow: 'hidden' } }
					>
						{ renderLayout() }
					</div>
				</div>
			</div>
		</div>
	);
}

function LayoutPreview( props ) {
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
			`wp-includes/css/dist/block-library/theme.min.css" media="all">
				<link rel="stylesheet" id="genesis-blocks-style-css-css" href="https://developer.wpengine.com/ecom/wp-content/plugins/genesis-page-builder/lib/genesis-blocks/dist/blocks.style.build.css?ver=1613169060" media="all">
				<link rel="stylesheet" id="genesis-page-builder-frontend-styles-css" href="https://developer.wpengine.com/ecom/wp-content/plugins/genesis-page-builder/build/frontend.styles.build.css?ver=1613169060" media="all">
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
				width: '375px',
				height: iframeInnerContentHeight * 0.195 + 'px',
			} }
		>
			<iframe
				ref={ iframeRef }
				onLoad={ onLoad }
				scrolling="no"
				style={ {
					width: '2000px',
					height: iframeInnerContentHeight + 'px',
					transform: 'scale(.195)',
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
