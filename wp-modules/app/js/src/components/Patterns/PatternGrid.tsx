// WP dependencies
import { __ } from '@wordpress/i18n';

// External dependencies
import loadable from '@loadable/component';

// Globals
import { patternManager } from '../../globals';

// Hooks
import useForceUpdate from '../../hooks/useForceUpdate';

// Components
const PatternPreview: PatternPreviewType = loadable(
	async () => import( '../PatternPreview' )
);
const PatternGridActions: PatternGridActionsType = loadable(
	async () => import( './PatternGridActions' )
);

// Types
import type { Patterns } from '../../types';
import type { PatternPreviewType } from '../PatternPreview';
import type { PatternGridActionsType } from './PatternGridActions';

type Props = {
	themePatterns: Patterns;
};

/** Render the patterns in a grid, or a message if no patterns are found. */
export default function PatternGrid( { themePatterns }: Props ) {
	// If the window is resized, trigger a fresh render of the grid.
	// Passing `themePatterns` also re-renders while searching or changing categories.
	// Helps ensure PatternPreview iFrames are the right size.
	useForceUpdate( [ themePatterns ] );

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

								<PatternGridActions
									patternData={ patternData }
								/>

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
