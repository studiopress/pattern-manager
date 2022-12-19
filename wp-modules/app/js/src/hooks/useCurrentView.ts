import { useState } from '@wordpress/element';
import { FseStudioViews } from '../types';

type PatternsView = 'theme_patterns' | 'pattern_editor';
type TemplatesView = 'theme_templates' | 'pattern_editor';

export default function useCurrentView( initialView: FseStudioViews ) {
	const [ currentView, setCurrentView ] = useState( initialView );
	const [ currentPatternsView, setCurrentPatternsView ] =
		useState< PatternsView >( 'theme_patterns' );
	const [ currentTemplatesView, setCurrentTemplatesView ] =
		useState< TemplatesView >( 'theme_templates' );

	function setCurrentViewConditions( newView: FseStudioViews ) {
		// When going from theme_patterns to pattern_editor, remember that theme_patterns is currently showing the pattern_editor.
		if (
			newView === 'pattern_editor' &&
			currentView === 'theme_patterns'
		) {
			setCurrentPatternsView( 'pattern_editor' );
			setCurrentTemplatesView( 'theme_templates' );
		}
		// When going from theme_templates to pattern_editor, remember that theme_templates is currently showing the pattern_editor.
		if (
			newView === 'pattern_editor' &&
			currentView === 'theme_templates'
		) {
			setCurrentPatternsView( 'theme_patterns' );
			setCurrentTemplatesView( 'pattern_editor' );
		}

		// When we go from any view to theme_patterns, if the pattern_editor is not active
		if (
			newView === 'theme_patterns' &&
			currentPatternsView === 'pattern_editor' &&
			currentView !== 'pattern_editor'
		) {
			setCurrentView( currentPatternsView );
			return;
		}

		// When we go from any view to theme_patterns, if the pattern_editor is not active
		if (
			newView === 'theme_templates' &&
			currentTemplatesView === 'pattern_editor' &&
			currentView !== 'pattern_editor'
		) {
			setCurrentView( currentTemplatesView );
			return;
		}

		setCurrentView( newView );
	}

	return {
		currentView,
		set: setCurrentViewConditions,
	};
}