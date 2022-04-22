// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

/**
 * @param {{
 *  themes: typeof import('../globals').fsestudio.themes
 * }} The themes.
 */
export default function useThemes( { themes } ) {
	/** @type {[typeof import('../globals').fsestudio.themes, React.Dispatch<React.SetStateAction<typeof import('../globals').fsestudio.themes>>]} */
	const [ theThemes, setTheThemes ] = useState( themes );

	return {
		themes: theThemes,
		setThemes: setTheThemes,
	};
}
