import { useState, useEffect } from '@wordpress/element';

/**
 * @param {import('../').InitialFseStudio.themeJsonFiles} initial
 * @return {{
 *  themeJsonFiles: import('../').InitialFseStudio.themeJsonFiles,
 *  setThemeJsonFiles: Function
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
