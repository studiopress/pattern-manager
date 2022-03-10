// @ts-check

import * as React from 'react';
import { useState } from '@wordpress/element';

/** @param {typeof import('../').fsestudio.patterns} initialPatterns */
export default function usePatterns( initialPatterns ) {
	/** @type {[typeof import('../').fsestudio.patterns, React.Dispatch<React.SetStateAction<typeof import('../').fsestudio.patterns>>]} */
	const [ patterns, setPatterns ] = useState( initialPatterns );

	return {
		patterns,
		setPatterns,
	};
}
