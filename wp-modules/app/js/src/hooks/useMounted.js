// @ts-check

import { useEffect, useRef } from '@wordpress/element';

export default function useMounted() {
	const mountedRef = useRef( false );

	useEffect( () => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	} );

	return {
		isMounted: () => mountedRef.current,
	};
}
