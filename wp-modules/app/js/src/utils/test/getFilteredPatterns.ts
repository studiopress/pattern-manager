import type { Patterns } from '../../types';
import getFilteredPatterns from '../getFilteredPatterns';

describe( 'getFilteredPatterns', () => {
	it.each< [ Patterns, string, Patterns ] >( [
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is example content',
				},
			},
			'',
			'',
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'uncategorized' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is example content',
					categories: [ 'uncategorized' ],
				},
			},
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'sports' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is example content',
					categories: [ 'theatre' ],
				},
			},
			'',
			'sports',
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'sports' ],
				},
			},
		],
	] )(
		'should get the filtered patterns',
		( patternsToFilter, searchTerm, categoryName, expected ) => {
			expect(
				getFilteredPatterns(
					patternsToFilter,
					searchTerm,
					categoryName
				)
			).toEqual( expected );
		}
	);
} );
