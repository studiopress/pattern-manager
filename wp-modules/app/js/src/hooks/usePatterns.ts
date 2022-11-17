/* eslint-disable no-undef */

import { useRef } from '@wordpress/element';

export default function usePatterns() {
	const refs = useRef( {} );

	return {
		addRef: ( key: string, newRef: HTMLIFrameElement ) => {
			refs.current[ key ] = newRef;
		},
		reloadPatternPreviews: () => {
			Object.values( refs.current ).forEach(
				( ref: HTMLIFrameElement ) => {
					ref?.contentWindow?.location.reload();
				}
			);
		},
	};
}
