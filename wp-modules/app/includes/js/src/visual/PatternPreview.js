
import { useContext, useState, useEffect, createPortal } from '@wordpress/element';

export function PatternPreview({wpHead, blockPatternData, wpFooter, themeJsonData, scale}) {
	
	return (
		<Portal scale={scale}>
			<div dangerouslySetInnerHTML={{ __html: wpHead }}/>
			<div dangerouslySetInnerHTML={{ __html: blockPatternData.content }} />
			<div dangerouslySetInnerHTML={{ __html: wpFooter }}/>
		</Portal>
	)
}

function Portal({children, scale = .05}) {
	const [iframeRef, setRef] = useState();
	const [iframeInnerContentHeight, setIframeInnerContentHeight] = useState(0);
	const container = iframeRef?.contentWindow?.document?.body;

	const scaleMultiplier = 10 / (scale*10);
	
	useEffect( () => {
		if ( iframeRef ) {
			setTimeout( () => {
				setIframeInnerContentHeight( container.scrollHeight );
			}, [1000]);
		}
	} );

	return (
		<div
		style={{
			position:'relative',
			width: '100%',
			height: iframeInnerContentHeight / scaleMultiplier,
			marginTop:'10px',
			marginBottom:'10px',
		}}>
			<iframe
				ref={setRef}
				style={ {
					position: 'absolute',
					top: '0',
					left: '0',
					width: 100 * scaleMultiplier + '%',
					height: 100 * scaleMultiplier + '%',
					display: 'block',
					transform: 'scale(' + scale + ')',
					transformOrigin: 'top left',
				} }
			>
				
				{container && createPortal(children, container)}
			</iframe>
		</div>
	);
}