// @ts-check

import * as React from 'react';
import { useState } from '@wordpress/element';

/** @param {{currentView: string}} initial */
export default function useCurrentView( initial ) {
	/** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
	const [ currentView, set ] = useState( initial.currentView );

	return {
		currentView,
		set,
	};
}
