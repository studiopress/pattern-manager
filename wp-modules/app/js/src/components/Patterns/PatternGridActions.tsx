// WP dependencies
import { __ } from '@wordpress/i18n';
import { Icon, trash, copy, settings } from '@wordpress/icons';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Utils
import deletePattern from '../../utils/deletePattern';
import getDuplicatePattern from '../../utils/getDuplicatePattern';
import getEditorUrl from '../../utils/getEditorUrl';

// Types
import type { Pattern, Patterns } from '../../types';

type Props = {
	themePatterns: Patterns;
	patternData: Pattern;
};

/** Render the pattern action buttons. */
export default function PatternGridActions( {
	themePatterns,
	patternData,
}: Props ) {
	const { notice, patterns } = usePmContext();
	return (
		<div className="item-actions">
			<a
				className="item-action-button"
				aria-label={ __( 'Edit Pattern', 'pattern-manager' ) }
				href={ getEditorUrl( patternData.name ) }
			>
				<Icon
					className="item-action-icon"
					icon={ settings }
					size={ 30 }
				/>
				<span className="item-action-button-text">
					{ __( 'Edit', 'pattern-manager' ) }
				</span>
			</a>

			<div className="item-action-button-separator"></div>

			<button
				type="button"
				className="item-action-button"
				aria-label={ __( 'Duplicate Pattern', 'pattern-manager' ) }
				onClick={ async () => {
					notice.set(
						__(
							'Duplicating your pattern and opening the editor for it…',
							'pattern-manager'
						)
					);
					const newPattern = getDuplicatePattern(
						patternData,
						Object.values( themePatterns ?? {} )
					);
					await patterns.savePattern( newPattern );
					location.href = getEditorUrl( newPattern.name );
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
					if (
						/* eslint-disable no-alert */
						window.confirm(
							__(
								'Are you sure you want to delete this pattern?',
								'pattern-manager'
							)
						)
					) {
						const newPatterns = deletePattern(
							patternData.name,
							patterns.data
						);
						patterns.set( newPatterns );
						patterns.savePatterns( newPatterns );
					}
				} }
			>
				<Icon className="item-action-icon" icon={ trash } size={ 30 } />
				<span className="item-action-button-text">Delete</span>
			</button>
		</div>
	);
}
