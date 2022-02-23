import { useState, useEffect, createPortal } from '@wordpress/element';

/* eslint-disable */
export function PatternPreview( {
	blockPatternData,
	themeJsonData,
	scale,
} ) {	
	return (
		<Portal scale={ scale }>
			<div className="wp-head" dangerouslySetInnerHTML={ { __html: themeJsonData?.patternPreviewParts?.wp_head } } />
			<div dangerouslySetInnerHTML={ { __html: themeJsonData?.patternPreviewParts?.renderedPatterns[blockPatternData.name] } } />
			<div className="wp-footer" dangerouslySetInnerHTML={ { __html: themeJsonData?.patternPreviewParts?.wp_footer } } />
		</Portal>
	);
}

function Portal( { children, scale = 0.05 } ) {
	const [ iframeRef, setRef ] = useState();
	const [ iframeInnerContentHeight, setIframeInnerContentHeight ] = useState(
		0
	);
	const container = iframeRef?.contentWindow?.document?.body;

	const scaleMultiplier = 10 / ( scale * 10 );

	useEffect( () => {
		if ( iframeRef ) {
			setInterval( () => {
				setIframeInnerContentHeight( container.scrollHeight );
			}, 1000 );
			
		}
	} );

	return (
		<div
			style={ {
				position: 'relative',
				width: '100%',
				height: iframeInnerContentHeight / scaleMultiplier,
				marginTop: '10px',
				marginBottom: '10px',
				pointerEvents: 'none',
			} }
		>
			<iframe
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
					overflow:'hidden',
					pointerEvents: 'none',
				} }
			>
				{ container && createPortal( children, container ) }
			</iframe>
		</div>
	);
}

/* eslint-enable */