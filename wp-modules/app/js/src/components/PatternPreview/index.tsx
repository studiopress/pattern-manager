// WP dependencies
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Hooks
import usePmContext from '../../hooks/usePmContext';
import useLazyRender from '../../hooks/useLazyRender';

type Props = {
	url: string;
	scale: number;
};

export default function PatternPreview( { url, scale }: Props ) {
	const { lazyContainerRef, lazyHasIntersected } =
		useLazyRender< HTMLDivElement >( {
			threshold: [ 0.3, 0.6, 1.0 ],
		} );

	return (
		<div
			ref={ lazyContainerRef }
			className="pattern-preview-iframe-outer"
			style={ {
				pointerEvents: 'none',
			} }
		>
			{ lazyHasIntersected ? (
				<PreviewIframe url={ url } scale={ scale } />
			) : null }
		</div>
	);
}

function PreviewIframe( { url, scale }: Props ) {
	const { patterns } = usePmContext();
	const [ iframeRef, setIframeRef ] = useState<
		HTMLIFrameElement | undefined
	>( undefined );
	patterns.addRef( url, iframeRef );
	const scaleMultiplier = 10 / ( scale * 10 );

	return (
		<iframe
			loading="lazy"
			src={ url }
			title={ __( 'Pattern Preview', 'pattern-manager' ) }
			role={ 'img' }
			ref={ setIframeRef }
			style={ {
				position: 'absolute',
				top: '0',
				left: '0',
				width: `${ 100 * scaleMultiplier }%`,
				height: `${ 100 * scaleMultiplier }%`,
				display: 'block',
				transform: 'scale(' + scale + ')',
				transformOrigin: 'top left',
				pointerEvents: 'none',
			} }
		/>
	);
}
