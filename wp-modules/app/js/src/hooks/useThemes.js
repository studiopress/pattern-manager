import { useState, useEffect } from '@wordpress/element';

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
