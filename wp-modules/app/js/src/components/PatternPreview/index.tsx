// WP dependencies
import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// External dependencies
import loadable from '@loadable/component';

// Hooks
import useLazyRender from '../../hooks/useLazyRender';

// Components
const PreviewIframe: PreviewIframeType = loadable(
	async () => import( './PreviewIframe' )
);

// Types
import type { PatternPreviewProps, BoundingClientRect } from './types';
import type { PreviewIframeType } from './PreviewIframe';

export default function PatternPreview( {
	url,
	viewportWidth,
}: PatternPreviewProps ) {
	const [ previewContainerSize, setPreviewContainerSize ] =
		useState< BoundingClientRect >();
	const previewContainer = useRef< HTMLDivElement | null >( null );
	const { lazyHasIntersected } = useLazyRender( previewContainer, {
		threshold: [ 0.3, 0.6, 1.0 ],
	} );

	useEffect( () => {
		if ( previewContainer?.current ) {
			setPreviewContainerSize(
				previewContainer?.current?.getBoundingClientRect()
			);
		}
	}, [ previewContainer ] );

	const scale = previewContainerSize
		? previewContainerSize?.width / viewportWidth
		: 0.2;

	return (
		<div
			className="pattern-preview-iframe-outer"
			style={ {
				pointerEvents: 'none',
			} }
			ref={ previewContainer }
		>
			{ lazyHasIntersected ? (
				<PreviewIframe
					url={ url }
					scale={ scale }
					viewportWidth={ viewportWidth }
					previewContainerSize={ previewContainerSize }
				/>
			) : null }
		</div>
	);
}

export type PatternPreviewType = typeof PatternPreview;
