import { useState } from '@wordpress/element';

/**
 * @param {string} initial
 * @return {{
 *  currentView: string,
 *  set: Function
 * }} The current view and a way to change it.
 */
export function useCurrentView( initial ) {
	const [ currentView, set ] = useState( initial );

	return {
		currentView,
		set,
	};
}
