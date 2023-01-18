// WP dependencies
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useState, useRef } from '@wordpress/element';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Components
import PatternCategories from './PatternCategories';
import PatternGrid from './PatternGrid';
import PatternSearch from './PatternSearch';

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
	const [ themePatterns, setThemePatterns ] = useState< Patterns >(
		// Object for included_patterns that includes an 'uncategorized' category.
		Object.keys( patterns.data ).reduce(
			( acc, patternName ) => ( {
				...acc,
				[ patternName ]: {
					...patterns.data[ patternName ],
					categories: [
						// Spread in the categories, or 'uncategorized' if empty.
						...( patterns.data[ patternName ].categories?.length
							? patterns.data[ patternName ].categories
							: [ 'uncategorized' ] ),
					],
				},
			} ),
			{}
		)
	);

	const patternsRef = useRef( themePatterns );

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
				{ Object.entries( patternsRef.current ?? {} ).length === 0 ? (
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
							<PatternSearch
								patternsRefCurrent={ patternsRef.current }
								setThemePatterns={ setThemePatterns }
							/>
							<PatternCategories
								categories={ patternCategories }
								currentCategory={ currentCategory }
								setCurrentCategory={ setCurrentCategory }
							/>
						</div>
						<div className="inner-grid">
							<PatternGrid
								themePatterns={ themePatterns }
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
