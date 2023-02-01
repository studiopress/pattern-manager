/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import getNextPatternIds from '../../utils/getNextPatternIds';
import usePmContext from '../../hooks/usePmContext';
import wpeLogoDefaultCropped from '../../../../img/WPE-LOGO-S-Default-Cropped.svg';
import addPattern from '../../utils/addPattern';
import getEditorUrl from '../../utils/getEditorUrl';

export default function Header() {
	const { patterns } = usePmContext();

	return (
		<div className="pattern-manager-header-container">
			<div className="header-container-logo">
				<img
					alt={ __( 'WP Engine logo', 'pattern-manager' ) }
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
					className="header-button"
					onClick={ async () => {
						// Get the new pattern title and slug.
						const { patternTitle, patternSlug } = getNextPatternIds(
							patterns.data
						);

						await patterns.save(
							addPattern(
								{
									title: patternTitle,
									name: patternSlug,
									slug: patternSlug,
									content: '',
								},
								patterns.data
							)
						);
						location.href = getEditorUrl( patternSlug );
					} }
				>
					{ __( 'Create New Pattern', 'pattern-manager' ) }
				</button>
			</div>
		</div>
	);
}
