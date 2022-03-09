// @ts-check

import { useState, useEffect, createPortal, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import '../PatternPicker/PatternPicker';

/**
 * @param {{
 *  blockPatternData: import('../PatternPicker/PatternPicker').Pattern,
 *  themeJsonData: Record<string, any>,
 *  scale: number,
 *  onLoad: Function
 * }} props
 */
export function PatternPreview( {
	blockPatternData,
	themeJsonData,
	scale,
	onLoad = () => {},
} ) {
	return (
		<Portal scale={ scale } onLoad={ onLoad }>
			<div
				className="wp-head"
				dangerouslySetInnerHTML={ {
					__html: themeJsonData?.patternPreviewParts?.wp_head,
				} }
			/>
			<div
				dangerouslySetInnerHTML={ {
					__html:
						themeJsonData?.patternPreviewParts?.renderedPatterns[
							blockPatternData?.name
						],
				} }
			/>
			<div
				className="wp-footer"
				dangerouslySetInnerHTML={ {
					__html: themeJsonData?.patternPreviewParts?.wp_footer,
				} }
			/>
		</Portal>
	);
}

function Portal( { onLoad = () => {}, children, scale = 0.05 } ) {
	const [ iframeRef, setRef ] = useState();
	const [ iframeInnerContentHeight, setIframeInnerContentHeight ] = useState(
		0
	);
	const isMountedRef = useRef( false );

	const container = iframeRef?.contentWindow?.document?.body;

	const scaleMultiplier = 10 / ( scale * 10 );

	useEffect( () => {
		// Call the onLoad 1ms after this component is mounted. This helps to space out the rendering of previews if desired.
		setTimeout( () => {
			onLoad();
		}, 1 );
	}, [] );

	useEffect( () => {
		if ( iframeRef ) {
			// 100ms after any change, check the height of the iframe and make its container match its height.
			setTimeout( () => {
				if ( isMountedRef.current ) {
					setIframeInnerContentHeight( container.scrollHeight );
				}
			}, 500 );
		}
	} );

	useEffect( () => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;
		};
	} );

	return (
		<>
			<div
				style={ {
					position: 'relative',
					width: '100%',
					height: iframeInnerContentHeight / scaleMultiplier,
					pointerEvents: 'none',
				} }
			>
				<iframe
					title={ __( 'Pattern Preview', 'fse-studio' ) }
					ref={ setRef }
					style={ {
						position: 'absolute',
						top: '0',
						left: '0',
						width: 100 * scaleMultiplier + '%',
						height: 100 * scaleMultiplier + '%',
						display: 'block',
						transform: 'scale(' + scale + ')',
						transformOrigin: 'top left',
						overflow: 'hidden',
						pointerEvents: 'none',
					} }
				>
					{ container && createPortal( children, container ) }
				</iframe>
			</div>
		</>
	);
}
