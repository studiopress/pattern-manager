// WP dependencies
import { __ } from '@wordpress/i18n';

// Globals
import { patternManager } from '../../globals';

// Components
import PatternPreview from '../PatternPreview';

// Utils
import PatternGridActions from './PatternGridActions';

// Types
import type { Patterns } from '../../types';

type props = {
	themePatterns: Patterns;
	currentCategory: string;
	categoryToAlwaysInclude: string;
};

export default function PatternGrid( {
	themePatterns,
	currentCategory,
	categoryToAlwaysInclude,
}: props ) {
	return (
		<div className="inner-grid">
			{ Object.entries( themePatterns ?? {} ).map(
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
			) }
		</div>
	);
}
