// WP dependencies
import { SearchControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Components
import PatternCategories from './PatternCategories';
import PatternGrid from './PatternGrid';

// Utils
import convertToUpperCase from '../../utils/convertToUpperCase';
import sortAlphabetically from '../../utils/sortAlphabetically';

// Types
import type { Patterns } from '../../types';

type Props = {
	isVisible: boolean;
};

export default function ThemePatterns( { isVisible }: Props ) {
	const { patterns } = usePmContext();
	const [ currentCategory, setCurrentCategory ] = useState( 'all-patterns' );
	const [ searchTerm, setSearchTerm ] = useState( '' );

	const filteredPatterns = searchTerm.trim()
		? Object.entries(
				createPatternsWithUncategorized( patterns.data )
		  ).reduce( ( acc, [ patternName, currentPattern ] ) => {
				const match = [ 'title', 'keywords', 'description' ].some(
					( key ) => {
						return currentPattern[ key ]
							?.toString()
							.toLowerCase()
							.includes( searchTerm.toString().toLowerCase() );
					}
				);

				return match
					? {
							...acc,
							[ patternName ]: currentPattern,
					  }
					: acc;
		  }, {} )
		: createPatternsWithUncategorized( patterns.data );

	/** Create an object for included_patterns that includes an 'uncategorized' category. */
	function createPatternsWithUncategorized( ownPatterns: Patterns ) {
		return Object.keys( ownPatterns ).reduce(
			( acc, patternName ) => ( {
				...acc,
				[ patternName ]: {
					...ownPatterns[ patternName ],
					categories: [
						// Spread in the categories, or 'uncategorized' if empty.
						...( ownPatterns[ patternName ].categories?.length
							? ownPatterns[ patternName ].categories
							: [ 'uncategorized' ] ),
					],
				},
			} ),
			{}
		);
	}

	if ( ! isVisible || ! patterns.data ) {
		return null;
	}

	/** Mapped array of categories present in patterns for the active theme. */
	const patternCategories = [
		// Keep all-patterns at top of list.
		{
			label: __( 'All Patterns', 'pattern-manager' ),
			name: 'all-patterns',
		},
		...sortAlphabetically(
			[
				// Array of unique category names.
				...Object.keys( filteredPatterns )
					.reduce( ( acc, patternName ) => {
						return [
							...acc,
							...filteredPatterns[
								patternName
							]?.categories?.filter( ( category ) => {
								return ! acc.includes( category );
							} ),
						];
					}, [] )
					// Map the array to expected object shape.
					.map( ( category ) => ( {
						label: convertToUpperCase(
							category.replace( /[-_]/g, ' ' )
						),
						name: category,
					} ) ),
			],
			// Sort by name property.
			'name'
		),
	];

	return (
		<div hidden={ ! isVisible } className="patternmanager-theme-patterns">
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
							<PatternCategories
								categories={ patternCategories }
								currentCategory={ currentCategory }
								setCurrentCategory={ setCurrentCategory }
							/>
						</div>
						<div className="inner-grid">
							<PatternGrid
								themePatterns={ filteredPatterns }
								currentCategory={ currentCategory }
								categoryToAlwaysInclude={ 'all-patterns' }
							/>
						</div>
					</>
				) }
			</div>
		</div>
	);
}
