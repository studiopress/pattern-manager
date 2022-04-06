// @ts-check

import * as React from 'react';
import { useState } from '@wordpress/element';

/** @param {string} initialView */
export default function useCurrentView( initialView ) {
	const [ currentView, set ] = useState( initialView );

	return {
		currentView,
		set,
	};
}
