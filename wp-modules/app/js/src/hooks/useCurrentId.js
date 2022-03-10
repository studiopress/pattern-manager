// @ts-check

import * as React from 'react';
import { useState } from '@wordpress/element';

/** @param {string} [initialId] */
export function useCurrentId( initialId ) {
	/** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
	const [ value, set ] = useState( initialId );

	return {
		value,
		set,
	};
}
