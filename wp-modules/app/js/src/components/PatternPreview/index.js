// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import useStudioContext from '../../hooks/useStudioContext';
/**
 * @param {{
 *  url: string,
 *  scale: number,
 * }} props
 */
export default function PatternPreview( {
	url,
	scale,
} ) {
	const [currentUrl, setCurrentUrl] = useState( url );
	const { currentTheme, currentView } = useStudioContext();
	const [ iframeRef, setRef ] = useState();
	const [ iframeInnerContentHeight, setIframeInnerContentHeight ] = useState(
		10
	);

	const scaleMultiplier = 10 / ( scale * 10 );
	
	useEffect( () => {
		if ( currentTheme.fetchInProgress ) {
			setCurrentUrl( '' );
		}
		if ( ! currentTheme.fetchInProgress ) {
			setCurrentUrl( url );
		}
	}, [ currentTheme.fetchInProgress ] );
	
	useEffect( () => {
		if ( iframeRef?.contentWindow?.document?.body?.scrollHeight ) {
			if ( iframeRef.contentWindow.document.body.scrollHeight > 0 ) {
				setIframeInnerContentHeight( iframeRef?.contentWindow.document.body.scrollHeight );
			}
		}
	}, [currentView.currentView] );

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
				src={currentUrl}
				title={ __( 'Pattern Preview', 'fse-studio' ) }
				role={ 'img' }
				// @ts-ignore
				ref={ setRef }
				onLoad={ () => {
					if ( iframeRef?.contentWindow?.document?.body?.scrollHeight ) {
						if ( iframeRef.contentWindow.document.body.scrollHeight > 0 ) {
							setIframeInnerContentHeight( iframeRef.contentWindow.document.body.scrollHeight );
						}
					}
				} }
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
			/>
		</div>
	);
}
