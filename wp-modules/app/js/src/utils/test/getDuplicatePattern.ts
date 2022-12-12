import { Pattern } from '../../types';
import getDuplicatePattern from '../getDuplicatePattern';

describe( 'getDuplicatePattern', () => {
	it.each< [ Pattern, Pattern[], Pattern ] >( [
		[
			{
				title: 'Foo',
				name: 'foo',
				slug: 'foo',
				content: 'Here is some content',
				type: 'pattern',
			},
			[],
			{
				title: 'Foo (copied)',
				name: 'foo-copied',
				slug: 'foo-copied',
				content: 'Here is some content',
				type: 'pattern',
			},
		],
		[
			{
				title: 'Foo',
				name: 'foo',
				slug: 'foo',
				content: 'Here is some content',
				type: 'pattern',
			},
			[
				{
					title: 'Foo (copied)',
					name: 'foo-copied',
					slug: 'foo-copied',
					content: 'Here is some content',
					type: 'pattern',
				},
			],
			{
				title: 'Foo (copied) 1',
				name: 'foo-copied-1',
				slug: 'foo-copied-1',
				content: 'Here is some content',
				type: 'pattern',
			},
		],
		[
			{
				title: 'Foo',
				name: 'foo',
				slug: 'foo',
				content: 'Here is some content',
				type: 'pattern',
			},
			[
				{
					title: 'Foo (copied) 2',
					name: 'foo-copied-2',
					slug: 'foo-copied-2',
					content: 'Here is some content',
					type: 'pattern',
				},
			],
			{
				title: 'Foo (copied) 3',
				name: 'foo-copied-3',
				slug: 'foo-copied-3',
				content: 'Here is some content',
				type: 'pattern',
			},
		],
	] )(
		'should get a duplicate pattern',
		( pattern, allPatterns, expected ) => {
			expect( getDuplicatePattern( pattern, allPatterns ) ).toEqual(
				expected
			);
		}
	);
} );
