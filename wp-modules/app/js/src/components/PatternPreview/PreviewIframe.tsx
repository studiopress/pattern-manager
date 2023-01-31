// WP dependencies
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Types
import type { PreviewIframeProps } from './types';

export default function PreviewIframe( {
	url,
	scale,
	viewportWidth,
	previewContainerSize,
}: PreviewIframeProps ) {
	const { patterns } = usePmContext();
	const [ iframeRef, setIframeRef ] = useState<
		HTMLIFrameElement | undefined
	>( undefined );
	patterns.addRef( url, iframeRef );

	return (
		<iframe
			src={ url }
			title={ __( 'Pattern Preview', 'pattern-manager' ) }
			role={ 'img' }
			ref={ setIframeRef }
			style={ {
				position: 'absolute',
				top: '0',
				left: '0',
				width: viewportWidth,
				height: previewContainerSize.height / scale,
				display: 'block',
				transform: 'scale(' + scale + ')',
				transformOrigin: 'top left',
				pointerEvents: 'none',
			} }
		/>
	);
}
