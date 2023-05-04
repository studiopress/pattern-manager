// WP dependencies
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Types
import type { PreviewIframeProps } from './types';

export default function PreviewIframe( {
	url,
	scale,
	viewportWidth,
}: PreviewIframeProps ) {
	const [ iframeRef, setIframeRef ] = useState<
		HTMLIFrameElement | undefined
	>( undefined );
	const [ iframeBodyHeight, setIframeBodyHeight ] = useState( 0 );
	const [ iframeLoaded, setIframeLoaded ] = useState( false );

	return (
		<>
			<div
				className="pattern-preview-iframe-inner"
				style={ {
					height: iframeBodyHeight * scale,
					opacity: iframeLoaded ? 1 : 0,
				} }
			>
				<iframe
					ref={ setIframeRef }
					onLoad={ () => {
						if (
							iframeRef?.contentWindow?.document?.documentElement
								?.scrollHeight
						) {
							if (
								iframeRef.contentWindow.document.documentElement
									.scrollHeight > 0
							) {
								setIframeBodyHeight(
									iframeRef.contentWindow.document
										.documentElement.scrollHeight
								);
							}
						}
						setIframeLoaded( true );
					} }
					src={ url }
					title={ __( 'Pattern Preview', 'pattern-manager' ) }
					role="img"
					tabIndex={ -1 }
					aria-hidden="true"
					style={ {
						width: viewportWidth,
						height: iframeBodyHeight,
						display: 'block',
						transform: 'scale(' + scale + ')',
						transformOrigin: 'top left',
						pointerEvents: 'none',
					} }
				/>
			</div>
			<div
				hidden={ iframeLoaded }
				className="pattern-loader"
			></div>
		</>
	);
}

export type PreviewIframeType = typeof PreviewIframe;
