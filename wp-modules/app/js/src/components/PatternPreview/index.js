// @ts-check

import * as React from 'react';
import { useState, useEffect, createPortal } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import useMounted from '../../hooks/useMounted';

/**
 * @param {{
 *  blockPatternData: import('../PatternPicker').Pattern,
 *  themeJsonData: import('../../hooks/useThemeJsonFile').ThemeData,
 *  scale: number,
 *  onLoad?: Function
 * }} props
 */
export default function PatternPreview( {
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

/**
 * @param {{
 *  onLoad: Function,
 *  children: React.ReactElement[],
 *  scale: number
 * }} props
 */
function Portal( { onLoad = () => {}, children, scale = 0.05 } ) {
	const [ iframeRef, setRef ] = useState();
	const [ iframeInnerContentHeight, setIframeInnerContentHeight ] = useState(
		0
	);
	const { isMounted } = useMounted();

	// @ts-ignore
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
				if ( isMounted() ) {
					setIframeInnerContentHeight( container.scrollHeight );
				}
			}, 500 );
		}
	} );

	return (
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
				role={ 'img' }
				// @ts-ignore
				ref={ setRef }
				style={ {
					position: 'absolute',
					top: '0',
					left: '0',
					width: `${ 100 * scaleMultiplier }%`,
					height: `${ 100 * scaleMultiplier }%`,
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
	);
}
