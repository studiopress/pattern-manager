// WP dependencies
import { __ } from '@wordpress/i18n';

// Globals
import { patternManager } from '../../globals';

// Hooks and Components
import { PatternPreview, useForceRerender } from '@pattern-manager/common';
import PatternGridActions from './PatternGridActions';

// Types
import type { Patterns } from '../../types';

type Props = {
	themePatterns: Patterns;
};

/** Render the patterns in a grid, or a message if no patterns are found. */
export default function PatternGrid( { themePatterns }: Props ) {
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
