import { patternManager } from '../globals';
import usePatternData from '../hooks/usePatternData';
import type { PostMeta } from '../types';

/**
 * Given an array of category selections, find the categories created by Pattern Manager.
 *
 * Human readable labels are used for the return array.
 */
export default function parseCustomCategories(
	selections: PostMeta[ 'categories' ],
	categoryOptions: ReturnType< typeof usePatternData >[ 'queriedCategories' ]
) {
	return categoryOptions.reduce(
		( acc: PostMeta[ 'customCategories' ], category ) => {
			const customCategoryFound =
				selections.includes( category.value ) &&
				new RegExp( `^${ patternManager.customCategoryPrefix }` ).test(
					category.value
				);

			return customCategoryFound ? [ ...acc, category.label ] : acc;
		},
		[]
	);
}
