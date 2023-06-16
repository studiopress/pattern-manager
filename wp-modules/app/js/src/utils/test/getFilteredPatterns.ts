/**
 * Internal dependencies
 */
import getFilteredPatterns from '../getFilteredPatterns';
import type { Patterns } from '../../types';

describe( 'getFilteredPatterns', () => {
	it.each( [
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
					content: 'Here is some content',
				},
			},
			'',
			'',
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
					content: 'Here is some content',
				},
			},
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
					categories: [ 'sports' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
					content: 'Here is some content',
					categories: [ 'theatre' ],
				},
			},
			'example',
			'',
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
					categories: [ 'sports' ],
				},
			},
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
					categories: [ 'something-random' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
					content: 'Here is some content',
				},
			},
			'',
			'all-patterns',
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
					categories: [ 'something-random' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
					content: 'Here is some content',
				},
			},
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
					categories: [ 'uncategorized' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
					content: 'Here is some content',
					categories: [ 'category-that-is-ignored' ],
				},
				'third-pattern': {
					title: 'Third Pattern',
					name: 'third-pattern',
					slug: 'third-pattern',
					editorLink: 'http://somesite.local/third-pattern',
					content: 'Here is even more content',
					categories: [ 'category-that-is-ignored' ],
				},
			},
			'example pattern',
			'category-that-is-ignored',
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
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
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
					categories: [ 'sports' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
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
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
					categories: [ 'sports' ],
				},
			},
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
					categories: [ 'sports' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
					content: 'Here is some content',
					categories: [ 'theatre' ],
				},
				'yet-another-pattern': {
					title: 'Yet Another Pattern',
					name: 'yet-another-pattern',
					slug: 'yet-another-pattern',
					editorLink: 'http://somesite.local/yet-another-pattern',
					content: 'And here is some content',
					categories: [ 'theatre' ],
				},
			},
			'another',
			'theatre',
			{
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
					content: 'Here is some content',
					categories: [ 'theatre' ],
				},
				'yet-another-pattern': {
					title: 'Yet Another Pattern',
					name: 'yet-another-pattern',
					slug: 'yet-another-pattern',
					editorLink: 'http://somesite.local/yet-another-pattern',
					content: 'And here is some content',
					categories: [ 'theatre' ],
				},
			},
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					editorLink: 'http://somesite.local/example-pattern',
					content: 'This is example content',
					categories: [ 'sports' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					editorLink: 'http://somesite.local/another-pattern',
					content: 'Here is some content',
					categories: [ 'theatre' ],
				},
				'yet-another-pattern': {
					title: 'Yet Another Pattern',
					name: 'yet-another-pattern',
					slug: 'yet-another-pattern',
					editorLink: 'http://somesite.local/yet-another-pattern',
					content: 'And here is some content',
					categories: [ 'theatre' ],
				},
			},
			'does not exist',
			'theatre',
			{},
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
