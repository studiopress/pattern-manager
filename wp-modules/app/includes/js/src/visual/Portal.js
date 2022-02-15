import { useState, createPortal } from '@wordpress/element';

export function Portal({ children }) {
	const [iframeRef, setRef] = useState();
	const container = iframeRef?.contentWindow?.document?.body;

	return (
		<iframe
			title="Preview"
			ref={setRef}
			style={{ width: '100%', height: '100%', display: 'block' }}
		>
			{container && createPortal(children, container)}
		</iframe>
	);
}
