import getCustomCategories from '../getCustomCategories';

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
					value: 'third-category',
				},
			],
			[],
		],
		[ [ 'third-category' ], [], [] ],
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
					pm_custom: true,
				},
			],
			[ 'Third Category' ],
		],
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
					pm_custom: true,
				},
				{
					label: 'Third Category',
					value: 'third-category',
					pm_custom: true,
				},
			],
			[ 'Second Category', 'Third Category' ],
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
