/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import type { MutableRefObject } from 'react';

/**
 * Delay the rendering of a child element until its containing parent is in view.
 *
 * __*Note:*__ this hook might not work as expected if used in markup that is rendered via a map.
 *
 * ---
 *
 * To use the hook, pass a ref to the hook and destructure the return values:
 *
 * ```jsx
 * const { lazyIsIntersecting, lazyHasIntersected } =
 *   useLazyRender< HTMLDivElement >( lazyContainerRef );
 *```
 *
 * Then render a child element only if the ref is currently in view:
 *
 * ```jsx
 * return (
 *   <div ref={ lazyContainerRef }>
 *     <div hidden={ ! lazyIsIntersecting }>
 *       <img src="arbitrary-image" />
 *     </div>
 *   </div>
 * );
 * ```
 *
 * Or delay the rendering of a more intensive element, then keep it in view:
 *
 * ```jsx
 * return (
 *   <div ref={ lazyContainerRef }>
 *     { lazyHasIntersected ? <iframe src="arbitrary-url" /> : null }
 *   </div>
 * );
 * ```
 *
 * ---
 *
 * __*Tip:*__ on refresh, if the ref is on-screen but hook values return `false`,
 * adjust `threshold` in `observerOptions`.
 */
export default function useLazyRender< T extends Element >(
	lazyContainerRef: MutableRefObject< T >,
	// Param type is equivalent to `IntersectionObserverInit`.
	observerOptions: {
		root?: Element | null;
		rootMargin?: string;
		threshold?: number | number[];
	} = {}
) {
	const [ lazyIsIntersecting, setLazyIsIntersecting ] = useState( false );
	const [ lazyHasIntersected, setLazyHasIntersected ] = useState( false );

	useEffect( () => {
		const observer = new IntersectionObserver(
			( [ observerEntry ]: IntersectionObserverEntry[] ) => {
				setLazyIsIntersecting( observerEntry.isIntersecting );
				setLazyHasIntersected( ( currentHasIntersected ) =>
					// This should always set `true` once the element has intersected.
					! currentHasIntersected
						? observerEntry.isIntersecting
						: currentHasIntersected
				);
			},
			observerOptions
		);

		observer.observe( lazyContainerRef.current );
		return () => {
			observer.disconnect();
		};
	}, [ lazyContainerRef ] );

	return {
		lazyIsIntersecting:
			// Ignore conditional rendering if IntersectionObserver isn't supported.
			'IntersectionObserver' in window ? lazyIsIntersecting : true,
		lazyHasIntersected:
			// Ignore delayed rendering if IntersectionObserver isn't supported.
			'IntersectionObserver' in window ? lazyHasIntersected : true,
	};
}
