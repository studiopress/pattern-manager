// @ts-check

import { useState } from '@wordpress/element';

/**
 * @param {import('../').InitialFseStudio.themeJsonFiles} initial
 * @return {{
 *  themeJsonFiles: import('../').InitialFseStudio.themeJsonFiles,
 *  setThemeJsonFiles: Function
 * }} The theme JSON files and a way to change them.
 */
export function useThemeJsonFiles( initial ) {
	const [ themeJsonFiles, setThemeJsonFiles ] = useState( initial );

	return {
		themeJsonFiles,
		setThemeJsonFiles,
	};
}
