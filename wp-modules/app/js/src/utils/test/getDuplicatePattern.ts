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
					title: 'Foo (copied) 9',
					name: 'foo-copied-9',
					slug: 'foo-copied-9',
					content: 'Here is some content',
					type: 'pattern',
				},
			],
			{
				title: 'Foo (copied) 10',
				name: 'foo-copied-10',
				slug: 'foo-copied-10',
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
