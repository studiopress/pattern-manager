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
			[ { name: 'example', attributes: { slug: 'example-pattern' } } ],
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
	] )(
		'should get whether there is a PM Pattern Block',
		( blocks, patternSlug, expected ) => {
			expect( hasPmPatternBlock( blocks, patternSlug ) ).toEqual(
				expected
			);
		}
	);
} );
