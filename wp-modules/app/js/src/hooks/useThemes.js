// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

/**
 * @param {{
 *  themes: typeof import('../components/FseStudioApp/test/FseStudioApp').fsestudio.themes,
 *  currentThemeJsonFile: ReturnType<import('./useThemeJsonFile').default>
 * }} The themes.
 */
export default function useThemes( { themes, currentThemeJsonFile } ) {
	/** @type {[typeof import('../components/FseStudioApp/test/FseStudioApp').fsestudio.themes, React.Dispatch<React.SetStateAction<typeof import('../components/FseStudioApp/test/FseStudioApp').fsestudio.themes>>]} */
	const [ theThemes, setTheThemes ] = useState( themes );

	useEffect( () => {
		currentThemeJsonFile.get();
	}, [ theThemes ] );

	return {
		themes: theThemes,
		setThemes: setTheThemes,
	};
}
