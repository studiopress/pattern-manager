/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	convertToUpperCase,
	sortAlphabetically,
} from 'common';
import type { Patterns, QueriedCategories } from '../types';

/** Create a mapping of unique categories for a dropdown or other list. */
export default function getUniquePatternCategories(
	patterns: Patterns,
	queriedCategories: QueriedCategories
) {
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
					.map( ( categoryName: string ) => {
						return {
							label:
								queriedCategories.find(
									( { name } ) => name === categoryName
								)?.label ||
								convertToUpperCase(
									categoryName.replace( /[-_]/g, ' ' )
								),
							name: categoryName,
						};
					} ),
			],
			// Sort by name property.
			'name'
		),
	];
}
