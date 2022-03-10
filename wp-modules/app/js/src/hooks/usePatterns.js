// @ts-check

import { useState } from '@wordpress/element';

/**
 * @param {module:Main.InitialFseStudio.patterns} initialPatterns
 * @return {{
 *  patterns: typeof import('../').fsestudio.patterns,
 *  setPatterns: Function
 * }} The patterns and a way to change them.
 */
export function usePatterns( initialPatterns ) {
	const [ patterns, setPatterns ] = useState( initialPatterns );

	return {
		patterns,
		setPatterns,
	};
}
