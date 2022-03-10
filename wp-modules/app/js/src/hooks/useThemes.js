// @ts-check

import { useState, useEffect } from '@wordpress/element';

/**
 * @param {{
 *  themes: typeof import('../').fsestudio.themes,
 *  currentThemeJsonFile: ReturnType<import('./useThemeJsonFile').useThemeJsonFile>
 * }} The themes and a way to change them.
 */
export function useThemes( { themes, currentThemeJsonFile } ) {
	/** @typedef {ReturnType<import('./useThemeData').useThemeData>} UseThemeData */
	const [ theThemes, setTheThemes ] = useState( themes );

	useEffect( () => {
		currentThemeJsonFile.get();
	}, [ theThemes ] );

	return {
		themes: theThemes,
		setThemes: setTheThemes,
	};
}
