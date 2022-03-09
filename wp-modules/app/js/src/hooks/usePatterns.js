// @ts-check

import { useState } from '@wordpress/element';

/**
 * @param {import('../').InitialFseStudio.patterns} initialPatterns
 * @return {{
 *  patterns: import('../').InitialFseStudio.patterns,
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
