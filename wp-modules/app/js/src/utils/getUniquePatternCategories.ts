import { __ } from '@wordpress/i18n';
import convertToUpperCase from './convertToUpperCase';
import sortAlphabetically from './sortAlphabetically';
import { Patterns } from '../types';

/** Create a mapping of unique categories for a dropdown or other list. */
export default function getUniquePatternCategories( patterns: Patterns ) {
	return [
		// Keep all-patterns at top of list.
		{
			label: __( 'All Patterns', 'pattern-manager' ),
			name: 'all-patterns',
		},
		...sortAlphabetically(
			[
				// Array of unique category names.
				...Object.entries( patterns )
					.reduce( ( acc, [ , { categories } ] ) => {
						return [
							...acc,
							...( categories
								? categories?.filter(
										( category ) =>
											! acc.includes( category )
								  )
								: [] ),
						];
					}, [] )
					// Map the array to expected object shape.
					.map( ( category: string ) => ( {
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
}
