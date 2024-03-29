import './index.scss';

// WP dependencies
import { SearchControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';

// Components
import PatternCategories from './PatternCategories';
import PatternGrid from './PatternGrid';
import SearchCount from './SearchCount';

// Utils
import createPatternsWithUncategorized from '../../utils/createPatternsWithUncategorized';
import getFilteredPatterns from '../../utils/getFilteredPatterns';
import getUniquePatternCategories from '../../utils/getUniquePatternCategories';

// Types
import type { PatternsProps } from '../../types';

export default function Patterns( {
	onSelectPattern,
	Notice,
	PatternActions,
	patternCategories,
	patterns,
	siteUrl,
}: PatternsProps ) {
	const [ currentCategory, setCurrentCategory ] = useState( 'all-patterns' );
	const [ searchTerm, setSearchTerm ] = useState( '' );

	const patternsWithUncategorized =
		createPatternsWithUncategorized( patterns );

	const filteredPatterns = getFilteredPatterns(
		patternsWithUncategorized,
		searchTerm,
		currentCategory
	);

	const uniqueCategories = getUniquePatternCategories(
		patternsWithUncategorized,
		patternCategories
	);

	return (
		<div className="pattern-manager-theme-patterns">
			<div className="patterns-container-inner">
				{ Notice }
				{ ! Object.entries( patterns ?? {} ).length ? (
					<div className="grid-empty">
						{ createInterpolateElement(
							__(
								'No patterns added yet. Click the <span></span> button to start creating and adding patterns.',
								'pattern-manager'
							),
							{
								span: (
									<strong>
										{ __(
											'Create New Pattern',
											'pattern-manager'
										) }
									</strong>
								),
							}
						) }
					</div>
				) : (
					<div className="pattern-columns">
						<div
							className="pattern-inner-sidebar"
							role="region"
							aria-label="Sort patterns by category"
						>
							<SearchControl
								className="pattern-search"
								label={ __(
									'Search Patterns',
									'pattern-manager'
								) }
								value={ searchTerm }
								onChange={ ( newSearchTerm: string ) => {
									setSearchTerm( newSearchTerm );
								} }
							/>
							{ searchTerm ? (
								<SearchCount
									resultsLength={
										Object.keys( filteredPatterns ).length
									}
									searchTerm={ searchTerm }
								/>
							) : (
								<PatternCategories
									categories={ uniqueCategories }
									currentCategory={ currentCategory }
									setCurrentCategory={ setCurrentCategory }
								/>
							) }
						</div>
						<div
							className="inner-grid"
							role="region"
							aria-label="Block Patterns"
						>
							<PatternGrid
								onSelectPattern={ onSelectPattern }
								PatternActions={ PatternActions }
								patterns={ filteredPatterns }
								siteUrl={ siteUrl }
							/>
						</div>
					</div>
				) }
			</div>
		</div>
	);
}
