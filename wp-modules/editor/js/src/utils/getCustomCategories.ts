import type { PostMeta } from '../types';

/**
 * Given an array of category selections, find the categories created by Pattern Manager.
 * Categories created by PM should have a `pm_custom` boolean property.
 *
 * Human readable labels are used for the return array.
 */
export default function getCustomCategories<
	T extends { label: string; value: string; pm_custom?: boolean },
>( selections: PostMeta[ 'categories' ], categoryOptions: T[] ) {
	return categoryOptions.reduce(
		( acc: PostMeta[ 'customCategories' ], category ) => {
			const customCategoryFound =
				selections.includes( category.value ) && category.pm_custom;

			return customCategoryFound ? [ ...acc, category.label ] : acc;
		},
		[]
	);
}
