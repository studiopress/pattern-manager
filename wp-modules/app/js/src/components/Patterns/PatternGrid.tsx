// WP dependencies
import { __ } from '@wordpress/i18n';

// External dependencies
import loadable from '@loadable/component';

// Globals
import { patternManager } from '../../globals';

// Hooks
import useForceRerender from '../../hooks/useForceRerender';

// Components
const PatternPreview: PatternPreviewType = loadable(
	async () => import( '../PatternPreview' )
);

// Types
import type { Pattern, Patterns } from '../../types';
import type { PatternPreviewType } from '../PatternPreview';

type Props = {
	onSelectPattern?: ( patternName: Pattern[ 'name' ] ) => void;
	PatternActions?: ( props: { patternData: Pattern } ) => JSX.Element;
	themePatterns: Patterns;
};

/** Render the patterns in a grid, or a message if no patterns are found. */
export default function PatternGrid( {
	onSelectPattern,
	PatternActions,
	themePatterns,
}: Props ) {
	useForceRerender( [ themePatterns ] );

	return (
		<>
			{ ! Object.entries( themePatterns ?? {} ).length ? (
				<div className="grid-no-patterns-found">
					{ __( 'No patterns found.', 'pattern-manager' ) }
				</div>
			) : (
				Object.entries( themePatterns ?? {} ).map(
					( [ patternName, patternData ] ) => {
						return (
							<div
								key={ patternName }
								onClick={ () => onSelectPattern( patternName ) }
								onKeyDown={ () => onSelectPattern( patternName ) }
								className="grid-item"
								aria-label={ patternData.title }
							>
								<div className="item-inner">
									<div className="item-pattern-preview">
										<PatternPreview
											key={ patternName }
											url={
												patternManager.siteUrl +
												'?pm_pattern_preview=' +
												patternData.name
											}
											viewportWidth={
												patternData.viewportWidth ||
												1280
											}
										/>
									</div>
								</div>
								{ PatternActions ? (
									<PatternActions
										patternData={ patternData }
									/>
								) : null }
								<div className="item-pattern-preview-heading">
									<span>{ patternData.title }</span>
								</div>
							</div>
						);
					}
				)
			) }
		</>
	);
}
