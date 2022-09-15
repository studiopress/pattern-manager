import getNextPatternIds from '../getNextPatternIds';

describe( 'getNextPatternIds', () => {
	it.each( [
		[
			{},
			{ patternTitle: 'My New Pattern', patternSlug: 'my-new-pattern' },
		],
		[
			{ pattern: { slug: 'abc-def' } },
			{ patternTitle: 'My New Pattern', patternSlug: 'my-new-pattern' },
		],
		[
			{ pattern: { slug: 'my-new-pattern' } },
			{
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
				patternTitle: 'My New Pattern 2',
				patternSlug: 'my-new-pattern-2',
			},
		],
	] )( 'should return new pattern title and slug', ( pattern, expected ) => {
		expect( getNextPatternIds( pattern ) ).toEqual( expected );
	} );
} );
