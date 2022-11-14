import { useState } from '@wordpress/element';

/**
 * @param {{
 *  themes: import('../types').Themes
 * }} The themes.
 */
export default function useThemes( { themes } ) {
	const [ theThemes, setTheThemes ] = useState( themes );

	return {
		themes: theThemes,
		setThemes: setTheThemes,
	};
}
