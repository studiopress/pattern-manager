// WP dependencies
import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Hooks
import usePmContext from '../../hooks/usePmContext';

type Props = {
	url: string;
	viewportWidth: number;
};

type BoundingClientRect = {
	width: number;
	height: number;
};

export default function PatternPreview( { url, viewportWidth }: Props ) {
	const { patterns } = usePmContext();
	const [ previewContainerSize, setPreviewContainerSize ] =
		useState< BoundingClientRect >();
	const [ iframeRef, setIframeRef ] = useState<
		HTMLIFrameElement | undefined
	>( undefined );
	const previewContainer = useRef< HTMLDivElement >();
	patterns.addRef( url, iframeRef );

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
					height: previewContainerSize?.height / scale,
					display: 'block',
					transform: 'scale(' + scale + ')',
					transformOrigin: 'top left',
					pointerEvents: 'none',
				} }
			/>
		</div>
	);
}
