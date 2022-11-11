// @ts-check

import React from 'react';
import { useState } from '@wordpress/element';

/**
 * @param {{
 *  themes: import('../types').Themes
 * }} The themes.
 */
export default function useThemes( { themes } ) {
	/** @type {[import('../types').Themes, React.Dispatch<React.SetStateAction<import('../types').Themes>>]} */
	const [ theThemes, setTheThemes ] = useState( themes );

	return {
		themes: theThemes,
		setThemes: setTheThemes,
	};
}
