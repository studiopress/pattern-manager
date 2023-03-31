import getCustomCategories from '../getCustomCategories';

const customCategoryPrefix = 'pm_custom_category_';

jest.mock( '../../globals', () => {
	return {
		patternManager: {
			customCategoryPrefix,
		},
	};
} );

describe( 'getCustomCategories', () => {
	it.each( [
		[
			[],
			[
				{
					label: 'First Category',
					value: 'first-category',
				},
				{
					label: 'Second Category',
					value: 'second-category',
				},
				{
					label: 'Third Category',
					value: `${ customCategoryPrefix }third-category`,
				},
			],
			[],
		],
		[ [ `${ customCategoryPrefix }third-category` ], [], [] ],
		[
			[ 'first-category', 'second-category', 'third-category' ],
			[
				{
					label: 'First Category',
					value: 'first-category',
				},
				{
					label: 'Second Category',
					value: 'second-category',
				},
				{
					label: 'Third Category',
					value: 'third-category',
				},
			],
			[],
		],
		[
			[
				'first-category',
				'second-category',
				`${ customCategoryPrefix }third-category`,
			],
			[
				{
					label: 'First Category',
					value: 'first-category',
				},
				{
					label: 'Second Category',
					value: 'second-category',
				},
				{
					label: 'Third Category',
					value: `${ customCategoryPrefix }third-category`,
				},
			],
			[ 'Third Category' ],
		],
		[
			[
				'first-category',
				`${ customCategoryPrefix }second-category`,
				`${ customCategoryPrefix }third-category`,
			],
			[
				{
					label: 'First Category',
					value: 'first-category',
				},
				{
					label: 'Second Category',
					value: `${ customCategoryPrefix }second-category`,
				},
				{
					label: 'Third Category',
					value: `${ customCategoryPrefix }third-category`,
				},
			],
			[ 'Second Category', 'Third Category' ],
		],
		[
			[
				`${ customCategoryPrefix }fourth-category`,
				`third-category-${ customCategoryPrefix }`, // Malformed string (prefix added as suffix).
			],
			[
				{
					label: 'First Category',
					value: 'first-category',
				},
				{
					label: 'Second Category',
					value: `${ customCategoryPrefix }second-category`,
				},
				{
					label: 'Third Category',
					value: `third-category${ customCategoryPrefix }`,
				},
				{
					label: 'Fourth Category',
					value: `${ customCategoryPrefix }fourth-category`,
				},
			],
			[ 'Fourth Category' ],
		],
	] )(
		'should get the custom categories created by Pattern Manager',
		( selections, categoryOptions, expected ) => {
			expect(
				getCustomCategories( selections, categoryOptions )
			).toEqual( expected );
		}
	);
} );
