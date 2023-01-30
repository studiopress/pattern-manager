// Globals
import { patternManager } from '../../globals';

// Components
import PatternPreview from '../PatternPreview';
import PatternGridActions from './PatternGridActions';

// Types
import type { Pattern, Patterns } from '../../types';

type Props = {
	themePatterns: Patterns;
	patternName: string;
	patternData: Pattern;
};

export default function PatternGridItem( {
	themePatterns,
	patternName,
	patternData,
}: Props ) {
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
