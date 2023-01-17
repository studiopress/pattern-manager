import { useState } from '@wordpress/element';
import { PatternManagerViews } from '../types';

export default function useCurrentView( initialView: PatternManagerViews ) {
	const [ currentView, setCurrentView ] = useState( initialView );

	return {
		currentView,
		set: setCurrentView,
	};
}
