// WP dependencies
import { __ } from '@wordpress/i18n';

// Globals
import { patternManager } from '../../globals';

// Components
import PatternPreview from '../PatternPreview';
import PatternGridActions from './PatternGridActions';

// Types
import type { Patterns } from '../../types';

type Props = {
	themePatterns: Patterns;
	currentCategory: string;
	categoryToAlwaysInclude: string;
};

/** Render the patterns in a grid, or a message if no patterns are found. */
export default function PatternGrid( {
	themePatterns,
	currentCategory,
	categoryToAlwaysInclude,
}: Props ) {
	return (
		<>
			{ ! Object.entries( themePatterns ?? {} ).length ? (
				<div className="grid-no-patterns-found">
					{ __( 'No patterns found.', 'pattern-manager' ) }
				</div>
			) : (
				Object.entries( themePatterns ?? {} ).map(
					( [ patternName, patternData ] ) => {
						if (
							! patternData?.categories?.includes(
								currentCategory
							) &&
							currentCategory !== categoryToAlwaysInclude
						) {
							return null;
						}

						return (
							<div key={ patternName } className="grid-item">
								<div className="item-inner">
									<div className="item-pattern-preview">
										<PatternPreview
											key={ patternName }
											url={
												patternManager.siteUrl +
												'?pm_pattern_preview=' +
												patternData.name
											}
											scale={ 0.2 }
										/>
									</div>
								</div>

								<PatternGridActions
									themePatterns={ themePatterns }
									patternName={ patternName }
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
