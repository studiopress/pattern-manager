// @ts-check

import { useState } from '@wordpress/element';

/**
 * @param {typeof import('../').fsestudio.themeJsonFiles} initial
 * @return {{
 *  themeJsonFiles: typeof import('../').fsestudio.themeJsonFiles,
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
