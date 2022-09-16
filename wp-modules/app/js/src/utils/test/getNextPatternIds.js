import getNextPatternIds from '../getNextPatternIds';

describe( 'getNextPatternIds', () => {
	it.each( [
		[
			{},
			{
				patternNumber: 0,
				patternTitle: 'My New Pattern',
				patternSlug: 'my-new-pattern',
			},
		],
		[
			{ pattern: { slug: 'abc-def' } },
			{
				patternNumber: 0,
				patternTitle: 'My New Pattern',
				patternSlug: 'my-new-pattern',
			},
		],
		[
			{ pattern: { slug: 'my-new-pattern' } },
			{
				patternNumber: 1,
				patternTitle: 'My New Pattern 1',
				patternSlug: 'my-new-pattern-1',
			},
		],
		[
			{
				pattern: { slug: 'my-new-pattern' },
				pattern1: { slug: 'my-new-pattern-1' },
				pattern2: { slug: 'some-pattern-33' },
			},
			{
				patternNumber: 2,
				patternTitle: 'My New Pattern 2',
				patternSlug: 'my-new-pattern-2',
			},
		],
		[
			{
				pattern: { slug: 'my-new-pattern-1' },
				pattern1: { slug: 'my-new-pattern-1-2' },
			},
			{
				patternNumber: 3,
				patternTitle: 'My New Pattern 3',
				patternSlug: 'my-new-pattern-3',
			},
		],
		[
			{
				pattern: { slug: 'my-new-pattern-1' },
				pattern1: { slug: 'my-new-pattern-1-2-3-4-5' },
			},
			{
				patternNumber: 6,
				patternTitle: 'My New Pattern 6',
				patternSlug: 'my-new-pattern-6',
			},
		],
	] )(
		'using default field param, should return new pattern title and slug',
		( pattern, expected ) => {
			expect( getNextPatternIds( pattern ) ).toEqual( expected );
		}
	);

	it.each( [
		[
			{ pattern: { title: 'Abc Def' } },
			{
				patternNumber: 0,
				patternTitle: 'My New Pattern',
				patternSlug: 'my-new-pattern',
			},
		],
		[
			{ pattern: { title: 'My New Pattern' } },
			{
				patternNumber: 1,
				patternTitle: 'My New Pattern 1',
				patternSlug: 'my-new-pattern-1',
			},
		],
		[
			{ pattern: { title: 'My New Pattern 22' } },
			{
				patternNumber: 23,
				patternTitle: 'My New Pattern 23',
				patternSlug: 'my-new-pattern-23',
			},
		],
		[
			{
				pattern: { title: 'My New Pattern' },
				pattern1: { title: 'My New Pattern 2' },
				pattern2: { title: 'My New Pattern 3' },
			},
			{
				patternNumber: 4,
				patternTitle: 'My New Pattern 4',
				patternSlug: 'my-new-pattern-4',
			},
		],
		[
			{
				pattern: { title: 'My New Pattern' },
				pattern1: { title: 'My New Pattern 2' },
				pattern2: { title: 'Some Other Pattern 3' },
			},
			{
				patternNumber: 3,
				patternTitle: 'My New Pattern 3',
				patternSlug: 'my-new-pattern-3',
			},
		],
		[
			{
				pattern: { title: 'My New Pattern' },
				pattern1: { title: 'My New Pattern 2' },
				pattern2: { title: 'My New Pattern 3 1' },
			},
			{
				patternNumber: 3,
				patternTitle: 'My New Pattern 3',
				patternSlug: 'my-new-pattern-3',
			},
		],
		[
			{
				pattern: { title: 'My New Pattern' },
				pattern1: { title: 'My New Pattern 2' },
				pattern2: { title: 'My New Pattern 3' },
				pattern3: { title: 'My New Pattern 3 1' },
			},
			{
				patternNumber: 4,
				patternTitle: 'My New Pattern 4',
				patternSlug: 'my-new-pattern-4',
			},
		],
	] )(
		'using title as field param, should return new pattern title and slug',
		( pattern, expected ) => {
			expect(
				getNextPatternIds( pattern, 'title', 'My New Pattern' )
			).toEqual( expected );
		}
	);

	it.each( [
		[
			{ pattern: { slug: 'some-pattern-44' } },
			{
				patternNumber: 1,
				patternTitle: 'Some Pattern 44 1',
				patternSlug: 'some-pattern-44-1',
			},
		],
		[
			{
				pattern: { slug: 'some-pattern' },
				pattern1: { slug: 'some-pattern-44' },
			},
			{
				patternNumber: 1,
				patternTitle: 'Some Pattern 44 1',
				patternSlug: 'some-pattern-44-1',
			},
		],
		[
			{
				pattern: { slug: 'some-pattern-44' },
				pattern1: { slug: 'some-pattern-44-1' },
				pattern2: { slug: 'some-pattern-44-2' },
			},
			{
				patternNumber: 3,
				patternTitle: 'Some Pattern 44 3',
				patternSlug: 'some-pattern-44-3',
			},
		],
	] )(
		'using custom base param, should return new pattern title and slug',
		( pattern, expected ) => {
			expect(
				getNextPatternIds( pattern, 'slug', 'some-pattern-44' )
			).toEqual( expected );
		}
	);
} );
