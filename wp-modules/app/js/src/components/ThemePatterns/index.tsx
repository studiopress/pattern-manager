// WP dependencies
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';

// Context
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
	const { currentTheme } = usePmContext();
	const [ currentCategory, setCurrentCategory ] = useState( 'all-patterns' );

	if ( ! isVisible || ! currentTheme.data ) {
		return null;
	}

	/** Object for included_patterns that includes an 'uncategorized' category. */
	const themePatterns: Patterns = Object.keys(
		currentTheme.data.included_patterns
	).reduce(
		( acc, patternName ) => ( {
			...acc,
			[ patternName ]: {
				...currentTheme.data.included_patterns[ patternName ],
				categories: [
					// Spread in the categories, or 'uncategorized' if empty.
					...( currentTheme.data.included_patterns[ patternName ]
						.categories?.length
						? currentTheme.data.included_patterns[ patternName ]
								.categories
						: [ 'uncategorized' ] ),
				],
			},
		} ),
		{}
	);

	/** Mapped array of categories present in patterns for the active theme. */
	const patternCategories = [
		// Keep all-patterns at top of list.
		{
			label: 'All Patterns',
			name: 'all-patterns',
		},
		...sortAlphabetically(
			[
				// Array of unique category names.
				...Object.keys( themePatterns )
					.reduce( ( acc, patternName ) => {
						return [
							...acc,
							...themePatterns[ patternName ]?.categories?.filter(
								( category ) => {
									return ! acc.includes( category );
								}
							),
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
				{ Object.entries( themePatterns ?? {} ).length === 0 ? (
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
						<PatternCategories
							categories={ patternCategories }
							currentCategory={ currentCategory }
							setCurrentCategory={ setCurrentCategory }
						/>
						<PatternGrid
							themePatterns={ themePatterns }
							currentCategory={ currentCategory }
							categoryToAlwaysInclude={ 'all-patterns' }
						/>
					</>
				) }
			</div>
		</div>
	);
}
