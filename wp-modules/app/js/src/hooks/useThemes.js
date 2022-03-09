// @ts-check

import { useState, useEffect } from '@wordpress/element';

/**
 * @param {{
 *  themes: import('../').InitialFseStudio.themeJsonFiles,
 *  currentThemeJsonFile: ReturnType<import('./useThemeJsonFile').useThemeJsonFile>
 * }} The themes and a way to change them.
 */
export function useThemes( { themes, currentThemeJsonFile } ) {
	const [ theThemes, setTheThemes ] = useState( themes );

	useEffect( () => {
		currentThemeJsonFile.get();
	}, [ theThemes ] );

	return {
		themes: theThemes,
		setThemes: setTheThemes,
	};
}
