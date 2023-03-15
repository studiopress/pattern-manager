import { useLayoutEffect, useState } from '@wordpress/element';

type WindowDimensions = [ number, number ];

/**
 * Re-render the calling component when the window is resized.
 *
 * Optionally include an array of dependencies to trigger a re-render.
 */
export default function useForceRerender< T extends unknown >(
	dependencies: T[]
) {
	const [ , setForceUpdate ] = useState< T[] | WindowDimensions >();

	useLayoutEffect( () => {
		setForceUpdate( dependencies );

		function updateSizeAndRerender() {
			setForceUpdate( [ window.innerWidth, window.innerHeight ] );
		}

		window.addEventListener( 'resize', updateSizeAndRerender );
		return () =>
			window.removeEventListener( 'resize', updateSizeAndRerender );
	}, [ ...dependencies ] );
}
