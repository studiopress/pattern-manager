import { useState } from '@wordpress/element';

export function useThemeJsonFiles( initialPatterns ) {
	const [ themeJsonFiles, setThemeJsonFiles ] = useState( initialPatterns );

	return {
		themeJsonFiles,
		setThemeJsonFiles,
	};
}