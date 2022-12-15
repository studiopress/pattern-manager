import { useRef } from '@wordpress/element';

export default function usePatterns() {
	const refs = useRef< { [ key: string ]: HTMLIFrameElement } >( {} );

	return {
		addRef: ( key: string, newRef: HTMLIFrameElement ) => {
			refs.current[ key ] = newRef;
		},
		reloadPatternPreviews: () => {
			Object.values( refs.current ).forEach( ( ref ) => {
				ref?.contentWindow?.location.reload();
			} );
		},
	};
}
