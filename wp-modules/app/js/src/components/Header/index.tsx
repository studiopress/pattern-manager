/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import getNextPatternIds from '../../utils/getNextPatternIds';
import usePmContext from '../../hooks/usePmContext';
import wpeLogoDefaultCropped from '../../../../img/WPE-LOGO-S-Default-Cropped.svg';

export default function Header() {
	const { currentPatternId, currentView, patterns } = usePmContext();

	return (
		<div className="pattern-manager-header-container">
			<div className="header-container-logo">
				<img
					className="logo-svg"
					aria-hidden="true"
					src={ wpeLogoDefaultCropped }
				/>
				<span className="logo-title">
					{ __( 'Pattern Manager', 'pattern-manager' ) }
				</span>
			</div>

			<div className="header-container-inner">
				<button
					type="button"
					disabled={ patterns.fetchInProgress }
					className="header-button"
					onClick={ () => {
						patterns.save();
					} }
				>
					{ patterns.isSaving ? (
						<>
							<Spinner />
							{ __( 'Saving', 'pattern-manager' ) }
						</>
					) : (
						__( 'Save', 'pattern-manager' )
					) }
				</button>

				<button
					className="header-button"
					onClick={ () => {
						// Get the new pattern title and slug.
						const { patternTitle, patternSlug } = getNextPatternIds(
							patterns.data
						);

						patterns.createPattern( {
							title: patternTitle,
							name: patternSlug,
							slug: patternSlug,
							categories: [],
							keywords: [],
							blockTypes: [],
							postTypes: [],
							inserter: true,
							description: '',
							viewportWidth: '',
							content: '',
						} );
						currentPatternId.set( patternSlug );
						currentView.set( 'pattern_editor' );
					} }
				>
					{ __( 'Create New Pattern', 'pattern-manager' ) }
				</button>
			</div>
		</div>
	);
}
