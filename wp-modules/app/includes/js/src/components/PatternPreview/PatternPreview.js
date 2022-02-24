import { useState, useEffect, createPortal } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function PatternPreview( { blockPatternData, themeJsonData, scale } ) {
	const [ initialLoaded, setInitialLoaded ] = useState( false );

	useState( () => {
		setTimeout( () => {
			setInitialLoaded( true );
		}, 100 );
	}, [] );

	if ( ! initialLoaded ) {
		return 'loading...';
	}

	return (
		<Portal scale={ scale }>
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
							blockPatternData.name
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

function Portal( { children, scale = 0.05 } ) {
	const [ iframeRef, setRef ] = useState();
	const [ iframeheightSet, setIframeheightSet ] = useState( false );
	const [ iframeInnerContentHeight, setIframeInnerContentHeight ] = useState(
		50
	);
	const container = iframeRef?.contentWindow?.document?.body;

	const scaleMultiplier = 10 / ( scale * 10 );

	useEffect( () => {
		if ( iframeRef && ! iframeheightSet ) {
			// Check after a second to see if the iframe's inner content height has changed
			setTimeout( () => {
				setIframeInnerContentHeight( container.scrollHeight );
				setIframeheightSet( true );
			}, 1000 );
		}
	} );

	function renderChildren() {
		return <div>{ children }</div>;
	}

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
				title={ __( 'Pattern Preview', 'fsestudio' ) }
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
				{ container && createPortal( renderChildren(), container ) }
			</iframe>
		</div>
	);
}
