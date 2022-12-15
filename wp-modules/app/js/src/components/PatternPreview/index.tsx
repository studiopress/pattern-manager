import React from 'react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import useStudioContext from '../../hooks/useStudioContext';

type Props = {
	url: string;
	scale: number;
};

export default function PatternPreview( { url, scale }: Props ) {
	const { patterns } = useStudioContext();
	const [ iframeInnerContentHeight, setIframeInnerContentHeight ] =
		useState( 10 );
	const [ iframeRef, setIframeRef ] = useState<
		HTMLIFrameElement | undefined
	>( undefined );
	patterns?.addRef( url, iframeRef );
	const scaleMultiplier = 10 / ( scale * 10 );

	return (
		<div
			style={ {
				position: 'relative',
				width: '100%',
				height: iframeInnerContentHeight / scaleMultiplier,
				pointerEvents: 'none',
			} }
		>
			<iframe
				src={ url }
				title={ __( 'Pattern Preview', 'fse-studio' ) }
				role={ 'img' }
				ref={ setIframeRef }
				onLoad={ () => {
					if (
						iframeRef?.contentWindow?.document?.body?.scrollHeight
					) {
						if (
							iframeRef.contentWindow.document.body.scrollHeight >
							0
						) {
							setIframeInnerContentHeight(
								iframeRef.contentWindow.document.body
									.scrollHeight
							);
						}
					}
				} }
				style={ {
					position: 'absolute',
					top: '0',
					left: '0',
					width: `${ 100 * scaleMultiplier }%`,
					height: `${ 100 * scaleMultiplier }%`,
					display: 'block',
					transform: 'scale(' + scale + ')',
					transformOrigin: 'top left',
					overflow: 'hidden',
					pointerEvents: 'none',
				} }
			/>
		</div>
	);
}
