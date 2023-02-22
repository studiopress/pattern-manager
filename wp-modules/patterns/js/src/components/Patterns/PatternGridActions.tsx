// WP dependencies
import { __ } from '@wordpress/i18n';
import { Icon, trash, copy, settings } from '@wordpress/icons';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Utils
import getAdminUrl from '../../utils/getAdminUrl';

// Types
import type { Pattern } from '../../types';

type Props = {
	patternData: Pattern;
};

/** Render the pattern action buttons. */
export default function PatternGridActions( { patternData }: Props ) {
	const { patterns } = usePmContext();
	return (
		<div className="item-actions">
			<div className="item-actions-inside">
				<a
					className="item-action-button"
					aria-label={ __( 'Edit Pattern', 'pattern-manager' ) }
					href={ patternData.editorLink }
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

				<a
					type="button"
					className="item-action-button"
					aria-label={ __( 'Duplicate Pattern', 'pattern-manager' ) }
					href={ getAdminUrl( {
						action: 'duplicate',
						name: patternData.name,
					} ) }
				>
					<Icon
						className="item-action-icon"
						icon={ copy }
						size={ 30 }
					/>
					<span className="item-action-button-text">
						{ __( 'Duplicate', 'pattern-manager' ) }
					</span>
				</a>

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
							patterns.deletePattern( patternData.name );
						}
					} }
				>
					<Icon
						className="item-action-icon"
						icon={ trash }
						size={ 30 }
					/>
					<span className="item-action-button-text">Delete</span>
				</button>
			</div>
		</div>
	);
}

export type PatternGridActionsType = typeof PatternGridActions;
