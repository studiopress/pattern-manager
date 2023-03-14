import { useLayoutEffect, useState, useRef } from '@wordpress/element';

type WindowDimensions = [ number, number ];

/**
 * Re-render the calling component when the window is resized.
 *
 * Optionally include an array of dependencies to trigger a re-render.
 */
export default function useForceRerend< T extends unknown >(
	dependencies: T[] = []
) {
	const [ , setForceUpdate ] = useState< T[] | WindowDimensions >();
	const initialRender = useRef( true );

	useLayoutEffect( () => {
		// Do not cause a re-render on first render.
		if ( initialRender.current ) {
			initialRender.current = false;
		} else {
			setForceUpdate( dependencies );
		}

		function updateSizeAndRerender() {
			setForceUpdate( [
				window.innerWidth,
				window.innerHeight,
			] as WindowDimensions );
		}

		window.addEventListener( 'resize', updateSizeAndRerender );
		return () =>
			window.removeEventListener( 'resize', updateSizeAndRerender );
	}, [ ...dependencies ] );
}
