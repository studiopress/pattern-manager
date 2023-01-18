// WP dependencies
import { __ } from '@wordpress/i18n';
import { Icon, close, copy, edit } from '@wordpress/icons';

// Context
import usePmContext from '../../hooks/usePmContext';

// Utils
import { getDuplicatePattern } from '../../utils';

// Types
import type { Pattern, Patterns } from '../../types';

type Props = {
	themePatterns: Patterns;
	patternName: string;
	patternData: Pattern;
};

export default function PatternGridActions( {
	themePatterns,
	patternName,
	patternData,
}: Props ) {
	const { patterns, currentView, currentPatternId } = usePmContext();

	return (
		<div className="item-actions">
			<button
				type="button"
				className="item-action-button"
				aria-label={ __( 'Edit Pattern', 'pattern-manager' ) }
				onClick={ () => {
					currentPatternId.set( patternName );
					currentView.set( 'pattern_editor' );
				} }
			>
				<Icon className="item-action-icon" icon={ edit } size={ 30 } />
				<span className="item-action-button-text">Edit</span>
			</button>

			<div className="item-action-button-separator"></div>

			<button
				type="button"
				className="item-action-button"
				aria-label={ __( 'Duplicate Pattern', 'pattern-manager' ) }
				onClick={ () => {
					const newPattern = getDuplicatePattern(
						patternData,
						Object.values( themePatterns ?? {} )
					);
					patterns.createPattern( newPattern ).then( () => {
						currentPatternId.set( newPattern.slug );
						currentView.set( 'pattern_editor' );
					} );
				} }
			>
				<Icon className="item-action-icon" icon={ copy } size={ 30 } />
				<span className="item-action-button-text">Duplicate</span>
			</button>

			<div className="item-action-button-separator"></div>

			<button
				type="button"
				className="item-action-button"
				aria-label={ __( 'Delete pattern', 'pattern-manager' ) }
				onClick={ () => {
					patterns.deletePattern( patternName );
				} }
			>
				<Icon className="item-action-icon" icon={ close } size={ 30 } />
				<span className="item-action-button-text">Delete</span>
			</button>
		</div>
	);
}
