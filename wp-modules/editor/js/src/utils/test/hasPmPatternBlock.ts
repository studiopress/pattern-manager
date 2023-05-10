import hasPmPatternBlock from '../hasPmPatternBlock';

describe( 'hasPmPatternBlock', () => {
	it.each( [
		[ [ { name: '', attributes: {} } ], '', false ],
		[ [ { name: '', attributes: {} } ], 'example-slug', false ],
		[
			[ { name: 'example', attributes: { slug: 'example-pattern' } } ],
			'other-pattern',
			false,
		],
		[
			[
				{
					name: 'example',
					attributes: { slug: 'example-pattern' },
					innerBlocks: [],
				},
			],
			'example-pattern',
			false,
		],
		[
			[
				{
					name: 'core/pattern',
					attributes: { slug: 'example-pattern' },
				},
			],
			'example-pattern',
			true,
		],
		[
			[
				{
					name: 'core/group',
					attributes: { align: 'full' },
					innerBlocks: [
						{
							name: 'core/pattern',
							attributes: { slug: 'inside-inner-blocks' },
							innerBlocks: [],
						},
					],
				},
			],
			'inside-inner-blocks',
			true,
		],
		[
			[
				{
					name: 'core/group',
					attributes: { align: 'full' },
					innerBlocks: [
						{
							name: 'core/group',
							attributes: { align: 'wide' },
							innerBlocks: [
								{
									name: 'core/pattern',
									attributes: {
										slug: 'inside-doubly-nested-inner-blocks',
									},
									innerBlocks: [],
								},
							],
						},
					],
				},
			],
			'inside-doubly-nested-inner-blocks',
			true,
		],
	] )(
		'should get whether there is a Pattern Block',
		( blocks, patternSlug, expected ) => {
			expect( hasPmPatternBlock( blocks, patternSlug ) ).toEqual(
				expected
			);
		}
	);
} );
