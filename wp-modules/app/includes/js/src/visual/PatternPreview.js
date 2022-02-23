import { useState, useEffect, createPortal } from '@wordpress/element';

/* eslint-disable */
export function PatternPreview( {
	blockPatternHTML,
	blockPatternData,
	themeJsonData,
	scale,
} ) {
	const patternPreview = usePatternPreview(blockPatternHTML);
	return (
		<Portal scale={ scale }>
			<div dangerouslySetInnerHTML={ { __html: patternPreview.renderedHTML } } />
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
			setTimeout( () => {
				setIframeInnerContentHeight( container.scrollHeight );
			}, [ 1000 ] );
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
				} }
			>
				{ container && createPortal( children, container ) }
			</iframe>
		</div>
	);
}

export function usePatternPreview(initialBlockPatternHTML) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [blockPatternHTML, setBlockPatternHTML] = useState( initialBlockPatternHTML );
	const [renderedBlockPatternHTML, setRenderedBlockPatternHTML ] = useState();

	useEffect( () => {
		getPatternPreviewParts();
	}, [] );

	function getPatternPreviewParts() {
		return new Promise( ( resolve ) => {
			if ( fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );
			fetch( fsestudio.apiEndpoints.getFrontendPreviewEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					blockPatternHTML
				} ),
			} )
			.then( ( response ) => response.json() )
			.then( ( response ) => {
				setFetchInProgress( false );
				setRenderedBlockPatternHTML( response.rendered_block_pattern_preview );
				resolve( response );
			} );
		} );
	}

	return {
		renderedHTML: renderedBlockPatternHTML,
		setBlockPatternHTML
	};
}
/* eslint-enable */
