import addNewCategory from '../addNewCategory';

const mockPatternCategories = [
	{
		label: 'First Category',
		name: 'first-category',
	},
	{
		label: 'Second Category',
		name: 'second-category',
	},
	{
		label: 'Third Category',
		name: 'third-category',
	},
];

const baseExpectedCategories = mockPatternCategories.map( ( category ) => ( {
	...category,
	value: category.name,
} ) );

describe( 'addNewCategory', () => {
	it.each( [
		[ mockPatternCategories, [], baseExpectedCategories ],
		[
			mockPatternCategories,
			[ 'New Category' ],
			[
				...baseExpectedCategories,
				{
					label: 'New Category',
					value: 'new-category',
					pm_custom: true,
				},
			],
		],
		[
			[
				...mockPatternCategories,
				{
					label: 'Duplicate Category',
					name: 'duplicate-category',
				},
			],
			// Duplicate category should not be added as custom since it already exists in `mockPatternCategories`.
			[ 'New Category', 'Another Category', 'Duplicate Category' ],
			[
				...baseExpectedCategories,
				{
					label: 'Duplicate Category',
					name: 'duplicate-category',
					value: 'duplicate-category',
					// There should not be a `pm_custom` property appended.
				},
				{
					label: 'New Category',
					value: 'new-category',
					pm_custom: true,
				},
				{
					label: 'Another Category',
					value: 'another-category',
					pm_custom: true,
				},
			],
		],
	] )(
		'should add new/missing items to pattern categories',
		( patternCategories, newCategories, expected ) => {
			expect(
				addNewCategory( patternCategories, newCategories )
			).toEqual( expected );
		}
	);
} );
