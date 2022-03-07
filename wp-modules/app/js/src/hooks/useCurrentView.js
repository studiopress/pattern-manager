import { useState } from '@wordpress/element';

export function useCurrentView( initial ) {
	const [ currentView, set ] = useState( initial.currentView );

	return {
		currentView,
		set,
	};
}
