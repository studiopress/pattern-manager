// @ts-check

import { useRef } from '@wordpress/element';

export default function usePatterns() {
	const refs = useRef( {} );

	return {
		addRef: ( key, newRef ) => {
			refs.current[ key ] = newRef;
		},
		reloadPatternPreviews: () => {
			Object.values( refs.current ).forEach( ( ref ) => {
				ref?.contentWindow?.location.reload();
			} );
		},
	};
}
