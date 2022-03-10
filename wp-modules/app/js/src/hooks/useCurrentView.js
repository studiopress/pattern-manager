// @ts-check

import * as React from 'react';
import { useState } from '@wordpress/element';

/** @param {string} initial */
export function useCurrentView( initial ) {
	/** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
	const [ currentView, set ] = useState( initial );

	return {
		currentView,
		set,
	};
}
