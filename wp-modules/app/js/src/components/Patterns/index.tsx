// WP dependencies
import { SearchControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Components
import PatternCategories from './PatternCategories';
import PatternGrid from './PatternGrid';
import SearchCount from './SearchCount';

// Utils
import createPatternsWithUncategorized from '../../utils/createPatternsWithUncategorized';
import getFilteredPatterns from '../../utils/getFilteredPatterns';
import getUniquePatternCategories from '../../utils/getUniquePatternCategories';

export default function Patterns() {
	const { patterns } = usePmContext();
	const [ currentCategory, setCurrentCategory ] = useState( 'all-patterns' );
	const [ searchTerm, setSearchTerm ] = useState( '' );

	const filteredPatterns = getFilteredPatterns(
		patterns.data,
		searchTerm,
		currentCategory
	);

	const filteredCategories = getUniquePatternCategories(
		searchTerm
			? filteredPatterns
			: // Get a fresh set of patterns with 'uncategorized'.
			  createPatternsWithUncategorized( patterns.data )
	);

	return (
		<div className="patternmanager-theme-patterns">
			<div className="patterns-container-inner">
				{ ! Object.entries( patterns.data ?? {} ).length ? (
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
											'Add New Pattern',
											'pattern-manager'
										) }
									</strong>
								),
							}
						) }
					</div>
				) : (
					<>
						<div className="inner-sidebar">
							<SearchControl
								className="pattern-search"
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
									categories={ filteredCategories }
									currentCategory={ currentCategory }
									setCurrentCategory={ setCurrentCategory }
								/>
							) }
						</div>
						<div className="inner-grid">
							<PatternGrid themePatterns={ filteredPatterns } />
						</div>
					</>
				) }
			</div>
		</div>
	);
}
