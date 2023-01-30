// WP dependencies
import { __ } from '@wordpress/i18n';
import { Icon, trash, copy, settings } from '@wordpress/icons';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Utils
import getDuplicatePattern from '../../utils/getDuplicatePattern';

// Types
import type { Pattern, Patterns } from '../../types';

type Props = {
	themePatterns: Patterns;
	patternName: string;
	patternData: Pattern;
};

/** Render the pattern action buttons. */
export default function PatternGridActions( {
	themePatterns,
	patternName,
	patternData,
}: Props ) {
	const { patterns, siteUrl } = usePmContext();
	return (
		<div className="item-actions">
			<a
				type="button"
				className="item-action-button"
				aria-label={ __( 'Edit Pattern', 'pattern-manager' ) }
				href={ `${ siteUrl }/wp-admin/post-new.php?post_type=pm_pattern&name=${ patternName }` }
			>
				<Icon
					className="item-action-icon"
					icon={ settings }
					size={ 30 }
				/>
				<span className="item-action-button-text">Edit</span>
			</a>

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
					patterns.createPattern( newPattern );
					// TODO: Maybe prompt to save, then go to the URL of the editor URL.
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
				<Icon className="item-action-icon" icon={ trash } size={ 30 } />
				<span className="item-action-button-text">Delete</span>
			</button>
		</div>
	);
}
