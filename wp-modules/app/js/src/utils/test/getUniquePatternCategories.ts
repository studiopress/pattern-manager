/**
 * Internal dependencies
 */
import getUniquePatternCategories from '../getUniquePatternCategories';
import type { Patterns, QueriedCategories } from '../../types';

type UniqueCategories = QueriedCategories;

describe( 'getUniquePatternCategories', () => {
	it.each< [ Patterns, QueriedCategories, UniqueCategories ] >( [
		[
			{},
			[],
			[
				{
					label: 'All Patterns',
					filename: 'all-patterns',
				},
			],
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					filename: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
				},
				'another-pattern': {
					title: 'Another Pattern',
					filename: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is some content',
				},
			},
			[],
			[
				{
					label: 'All Patterns',
					filename: 'all-patterns',
				},
			],
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					filename: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'some-category' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					filename: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is some content',
				},
			},
			[
				{
					label: 'Some Category',
					filename: 'some-category',
				},
			],
			[
				{
					label: 'All Patterns',
					filename: 'all-patterns',
				},
				{
					label: 'Some Category',
					filename: 'some-category',
				},
			],
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					filename: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'some-category' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					filename: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is some content',
					categories: [ 'some-category' ],
				},
				'third-pattern': {
					title: 'Third Pattern',
					filename: 'third-pattern',
					slug: 'third-pattern',
					content: 'Here is more content',
					categories: [ 'some-category' ],
				},
			},
			[
				{
					label: 'Some Category',
					filename: 'some-category',
				},
			],
			[
				{
					label: 'All Patterns',
					filename: 'all-patterns',
				},
				{
					label: 'Some Category',
					filename: 'some-category',
				},
			],
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					filename: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'some-category' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					filename: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is some content',
					categories: [ 'another-category' ],
				},
				'third-pattern': {
					title: 'Third Pattern',
					filename: 'third-pattern',
					slug: 'third-pattern',
					content: 'Here is more content',
					categories: [ 'some-category' ],
				},
			},
			[
				{
					label: 'Another Category',
					filename: 'another-category',
				},
				{
					label: 'Some Category',
					filename: 'some-category',
				},
			],
			[
				{
					label: 'All Patterns',
					filename: 'all-patterns',
				},
				{
					label: 'Another Category',
					filename: 'another-category',
				},
				{
					label: 'Some Category',
					filename: 'some-category',
				},
			],
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					filename: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'uncategorized' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					filename: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is some content',
					categories: [ 'some-category' ],
				},
				'third-pattern': {
					title: 'Third Pattern',
					filename: 'third-pattern',
					slug: 'third-pattern',
					content: 'Here is more content',
				},
			},
			[
				{
					label: 'Category to Skip',
					filename: 'category-to-skip',
				},
				{
					label: 'Some Category',
					filename: 'some-category',
				},
			],
			[
				{
					label: 'All Patterns',
					filename: 'all-patterns',
				},
				{
					label: 'Some Category',
					filename: 'some-category',
				},
				{
					label: 'Uncategorized',
					filename: 'uncategorized',
				},
			],
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					filename: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'uncategorized' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					filename: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is some content',
					categories: [ 'some-category' ],
				},
				'third-pattern': {
					title: 'Third Pattern',
					filename: 'third-pattern',
					slug: 'third-pattern',
					content: 'Here is more content',
					categories: [ 'third-category' ],
				},
				'fourth-pattern': {
					title: 'Fourth Pattern',
					filename: 'fourth-pattern',
					slug: 'fourth-pattern',
					content: 'This is even more content',
					categories: [ 'uncategorized' ],
				},
				'fifth-pattern': {
					title: 'Fifth Pattern',
					filename: 'fifth-pattern',
					slug: 'fifth-pattern',
					content: "Wow. That's a lot of content!",
				},
			},
			[
				{
					label: 'Another Category',
					filename: 'another-category',
				},
				{
					label: 'Some Category',
					filename: 'some-category',
				},
				{
					label: 'Third Category',
					filename: 'third-category',
				},
				{
					label: 'Fourth Category',
					filename: 'fourth-category',
				},
			],
			[
				{
					label: 'All Patterns',
					filename: 'all-patterns',
				},
				{
					label: 'Some Category',
					filename: 'some-category',
				},
				{
					label: 'Third Category',
					filename: 'third-category',
				},
				{
					label: 'Uncategorized',
					filename: 'uncategorized',
				},
			],
		],
	] )(
		'should return unique pattern categories',
		(
			patterns: Patterns,
			queriedCategories,
			expected: { label: string; filename: string }[]
		) => {
			expect(
				getUniquePatternCategories( patterns, queriedCategories )
			).toEqual( expected );
		}
	);
} );
