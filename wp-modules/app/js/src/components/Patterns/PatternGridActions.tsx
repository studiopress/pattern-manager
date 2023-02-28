// WP dependencies
import { sprintf, __ } from '@wordpress/i18n';
import { Icon, trash, copy, settings } from '@wordpress/icons';
import { Button } from '@wordpress/components';

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
				<Button
					className="item-action-button"
					aria-label={ sprintf(
						/* translators: %1$s: the pattern title */
						__( 'Edit %1$s', 'pattern-manager' ),
						patternData.title
					) }
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
				</Button>

				<div className="item-action-button-separator"></div>

				<Button
					type="button"
					className="item-action-button"
					aria-label={ sprintf(
						/* translators: %1$s: the pattern title */
						__( 'Duplicate %1$s', 'pattern-manager' ),
						patternData.title
					) }
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
				</Button>

				<div className="item-action-button-separator"></div>

				<Button
					type="button"
					className="item-action-button"
					aria-label={ sprintf(
						/* translators: %1$s: the pattern title */
						__( 'Delete %1$s', 'pattern-manager' ),
						patternData.title
					) }
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
				</Button>
			</div>
		</div>
	);
}

export type PatternGridActionsType = typeof PatternGridActions;
