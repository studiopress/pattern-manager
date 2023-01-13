import React from 'react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import usePmContext from '../../hooks/usePmContext';

type Props = {
	url: string;
	scale: number;
};

export default function PatternPreview( { url, scale }: Props ) {
	const { patterns } = usePmContext();
	const [ iframeRef, setIframeRef ] = useState<
		HTMLIFrameElement | undefined
	>( undefined );
	patterns?.addRef( url, iframeRef );
	const scaleMultiplier = 10 / ( scale * 10 );

	return (
		<div
			className="pattern-preview-iframe-outer"
			style={ {
				pointerEvents: 'none',
			} }
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
					width: `${ 100 * scaleMultiplier }%`,
					height: `${ 100 * scaleMultiplier }%`,
					display: 'block',
					transform: 'scale(' + scale + ')',
					transformOrigin: 'top left',
					pointerEvents: 'none',
				} }
			/>
		</div>
	);
}
