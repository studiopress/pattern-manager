import { useState } from '@wordpress/element';
import { PatternManagerViews } from '../types';

type PatternsView = 'theme_patterns' | 'pattern_editor';
type TemplatesView = 'theme_templates' | 'pattern_editor';

export default function useCurrentView( initialView: PatternManagerViews ) {
	const [ currentView, setCurrentView ] = useState( initialView );

	return {
		currentView,
		set: setCurrentView
	};
}
