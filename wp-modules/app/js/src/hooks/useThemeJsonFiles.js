// @ts-check

import * as React from 'react';
import { useState } from '@wordpress/element';

/** @param {typeof import('../').fsestudio.themeJsonFiles} initial */
export function useThemeJsonFiles( initial ) {
	/** @type {[typeof import('../').fsestudio.themeJsonFiles, React.Dispatch<React.SetStateAction<typeof import('../').fsestudio.themeJsonFiles>>]} */
	const [ themeJsonFiles, setThemeJsonFiles ] = useState( initial );

	return {
		themeJsonFiles,
		setThemeJsonFiles,
	};
}
