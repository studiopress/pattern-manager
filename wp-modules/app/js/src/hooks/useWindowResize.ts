import { useLayoutEffect, useState } from '@wordpress/element';

/** Rerender the calling component when the window is resized. */
export default function useWindowResize() {
	const [ , setWindowSize ] = useState( [ 0, 0 ] );

	useLayoutEffect( () => {
		function updateSizeAndRerender() {
			setWindowSize( [ window.innerWidth, window.innerHeight ] );
		}

		window.addEventListener( 'resize', updateSizeAndRerender );
		return () =>
			window.removeEventListener( 'resize', updateSizeAndRerender );
	}, [] );
}
