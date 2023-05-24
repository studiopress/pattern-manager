import convertToSlug from './convertToSlug';
import type { Pattern, InitialPatternManager } from '../types';

/** Add new categories to the array of patternCategories, mapped for react-select. */
export default function addNewCategory(
	patternCategories: InitialPatternManager[ 'patternCategories' ],
	customCategories: Pattern[ 'categories' ]
) {
	return customCategories.reduce(
		( accumulator, categoryLabel ) => {
			// If the category is not found in `patternCategories`, it is a new category.
			const isNewCategory = ! patternCategories.some(
				( queriedCategory ) => queriedCategory.label === categoryLabel
			);

			return isNewCategory
				? [
						...accumulator,
						// Add the new category with a slug and pm_custom value.
						{
							label: categoryLabel,
							value: convertToSlug( categoryLabel ),
							pm_custom: true,
						},
				  ]
				: accumulator;
		},
		patternCategories.map( ( category ) => ( {
			label: category.label,
			value: category.name,
			...category,
		} ) )
	);
}
