import {
	useState,
	useEffect,
	createPortal
} from '@wordpress/element';

export function Portal({head, children}) {
	const [iframeRef, setRef] = useState();
	const [iframeInnerContentHeight, setIframeInnerContentHeight] = useState(0);
	const container = iframeRef?.contentWindow?.document?.body;
	
	useEffect( () => {
		if ( iframeRef ) {
			setIframeInnerContentHeight( container.scrollHeight );
		}
	} );

	return (
		<iframe
			ref={setRef}
			style={ { width: '100%', height: '100%', display: 'block' } }
		>
			
			{container && createPortal(children, container)}
		</iframe>
	);
}