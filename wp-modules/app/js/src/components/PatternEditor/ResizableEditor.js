/**
 * WordPress dependencies
 */
/* eslint-disable */
import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { ResizableBox } from '@wordpress/components';
import {
	__experimentalUseResizeCanvas as useResizeCanvas,
	__unstableEditorStyles as EditorStyles,
	__unstableIframe as Iframe,
	__unstableUseMouseMoveTypingReset as useMouseMoveTypingReset,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMergeRefs } from '@wordpress/compose';

/**
 * Internal dependencies
 */
//import { store as editSiteStore } from '../../store';
//import ResizeHandle from './resize-handle';

const DEFAULT_STYLES = {
	width: '100%',
	height: '100%',
};

// Removes the inline styles in the drag handles.
const HANDLE_STYLES_OVERRIDE = {
	position: undefined,
	userSelect: undefined,
	cursor: undefined,
	width: undefined,
	height: undefined,
	top: undefined,
	right: undefined,
	bottom: undefined,
	left: undefined,
};

function ResizableEditor( { enableResizing, settings, ...props } ) {
	const [ width, setWidth ] = useState( DEFAULT_STYLES.width );
	const [ height, setHeight ] = useState( DEFAULT_STYLES.height );
	const iframeRef = useRef();
	const mouseMoveTypingResetRef = useMouseMoveTypingReset();
	const ref = useMergeRefs( [ iframeRef, mouseMoveTypingResetRef ] );

	useEffect(
		function autoResizeIframeHeight() {
			const iframe = iframeRef.current;

			if ( ! iframe || ! enableResizing ) {
				return;
			}

			let animationFrame = null;

			function resizeHeight() {
				if ( ! animationFrame ) {
					// Throttle the updates on animation frame.
					animationFrame = iframe.contentWindow.requestAnimationFrame(
						() => {
							setHeight(
								iframe.contentDocument.documentElement
									.scrollHeight
							);
							animationFrame = null;
						}
					);
				}
			}

			let resizeObserver;

			function registerObserver() {
				resizeObserver?.disconnect();

				resizeObserver = new iframe.contentWindow.ResizeObserver(
					resizeHeight
				);
				// Observing the <html> rather than the <body> because the latter
				// gets destroyed and remounted after initialization in <Iframe>.
				resizeObserver.observe(
					iframe.contentDocument.documentElement
				);

				resizeHeight();
			}

			// This is only required in Firefox for some unknown reasons.
			iframe.addEventListener( 'load', registerObserver );
			// This is required in Chrome and Safari.
			registerObserver();

			return () => {
				iframe.contentWindow?.cancelAnimationFrame( animationFrame );
				resizeObserver?.disconnect();
				iframe.removeEventListener( 'load', registerObserver );
			};
		},
		[ enableResizing ]
	);

	const resizeWidthBy = useCallback( ( deltaPixels ) => {
		if ( iframeRef.current ) {
			setWidth( iframeRef.current.offsetWidth + deltaPixels );
		}
	}, [] );

	return (
		<Iframe
			style={ { width: '100%', height: '100%' } }
			head={
				<>
					<EditorStyles styles={ settings.styles } />
					<style>{
						// Forming a "block formatting context" to prevent margin collapsing.
						// @see https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
						`.is-root-container { display: flow-root; }`
					}</style>
					{ enableResizing && (
						<style>
							{
								// Force the <html> and <body>'s heights to fit the content.
								`html, body { height: -moz-fit-content !important; height: fit-content !important; min-height: 0 !important; }`
							}
							{
								// Some themes will have `min-height: 100vh` for the root container,
								// which isn't a requirement in auto resize mode.
								`.is-root-container { min-height: 0 !important; }`
							}
						</style>
					) }
				</>
			}
			assets={ settings.__unstableResolvedAssets }
			ref={ ref }
			name="editor-canvas"
			className="edit-site-visual-editor__editor-canvas"
			{ ...props }
		/>
	);
}

export default ResizableEditor;
