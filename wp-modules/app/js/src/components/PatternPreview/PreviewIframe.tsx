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
	return (
		<iframe
			src={ url }
			title={ __( 'Pattern Preview', 'pattern-manager' ) }
			role="img"
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

export type PreviewIframeType = typeof PreviewIframe;
