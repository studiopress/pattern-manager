import { useState, useEffect, createPortal } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function PatternPreview( {
	blockPatternData,
	themeJsonData,
	scale,
	onLoad = () => {},
} ) {
	const [ initialLoaded, setInitialLoaded ] = useState( false );

	useState( () => {
		setTimeout( () => {
			setInitialLoaded( true );
		}, 100 );
	}, [] );

	if ( ! initialLoaded ) {
		return <div>loading...</div>;
	}

	return (
		<Portal scale={ scale } onLoad={ onLoad }>
			<div
				className="wp-head"
				dangerouslySetInnerHTML={ {
					__html: themeJsonData?.patternPreviewParts?.wp_head,
				} }
			/>
			<div
				className="wp-footer"
				dangerouslySetInnerHTML={ {
					__html: themeJsonData?.patternPreviewParts?.wp_footer,
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
		</Portal>
	);
}

function Portal( { onLoad = () => {}, children, scale = 0.05 } ) {
	const [ iframeRef, setRef ] = useState();
	const [ iframeheightSet, setIframeheightSet ] = useState( false );
	const [ iframeInnerContentHeight, setIframeInnerContentHeight ] = useState(
		0
	);

	const container = iframeRef?.contentWindow?.document?.body;

	const scaleMultiplier = 10 / ( scale * 10 );

	useEffect( () => {
		if ( iframeRef ) {
			if ( ! iframeheightSet ) {
				setIframeInnerContentHeight( container.scrollHeight );
			}

			// Putting this into a timeout causes all iframes to get properly set heights.
			setTimeout( () => {
				setIframeInnerContentHeight( container.scrollHeight );
				setTimeout( () => {
					setIframeheightSet( true );
					onLoad();
				}, 100 );
			}, 1 );
		}
	} );

	function maybeRenderSpinner() {
		if ( ! iframeheightSet ) {
			return (
				<div
					style={ {
						padding: '10px',
						position: 'absolute',
						zIndex: '10',
					} }
				>
					loading...
				</div>
			);
		}
	}

	return (
		<>
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
				{ maybeRenderSpinner() }
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
						visibility: iframeheightSet ? 'visible' : 'hidden',
					} }
				>
					{ container && createPortal( children, container ) }
				</iframe>
			</div>
		</>
	);
}
