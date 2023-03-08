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
					name: 'all-patterns',
				},
			],
		],
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
					content: 'Here is some content',
				},
			},
			[],
			[
				{
					label: 'All Patterns',
					name: 'all-patterns',
				},
			],
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'some-category' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is some content',
				},
			},
			[
				{
					label: 'Some Category',
					name: 'some-category',
				}
			],
			[
				{
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Some Category',
					name: 'some-category',
				},
			],
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'some-category' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is some content',
					categories: [ 'some-category' ],
				},
				'third-pattern': {
					title: 'Third Pattern',
					name: 'third-pattern',
					slug: 'third-pattern',
					content: 'Here is more content',
					categories: [ 'some-category' ],
				},
			},
			[
				{
					label: 'Some Category',
					name: 'some-category',
				}
			],
			[
				{
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Some Category',
					name: 'some-category',
				},
			],
		],
		[
			{
				'example-pattern': {
					title: 'Example Pattern',
					name: 'example-pattern',
					slug: 'example-pattern',
					content: 'This is example content',
					categories: [ 'some-category' ],
				},
				'another-pattern': {
					title: 'Another Pattern',
					name: 'another-pattern',
					slug: 'another-pattern',
					content: 'Here is some content',
					categories: [ 'another-category' ],
				},
				'third-pattern': {
					title: 'Third Pattern',
					name: 'third-pattern',
					slug: 'third-pattern',
					content: 'Here is more content',
					categories: [ 'some-category' ],
				},
			},
			[
				{
					label: 'Another Category',
					name: 'another-category',
				},
				{
					label: 'Some Category',
					name: 'some-category',
				},
			],
			[
				{
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Another Category',
					name: 'another-category',
				},
				{
					label: 'Some Category',
					name: 'some-category',
				},
			],
		],
		[
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
					content: 'Here is some content',
					categories: [ 'some-category' ],
				},
				'third-pattern': {
					title: 'Third Pattern',
					name: 'third-pattern',
					slug: 'third-pattern',
					content: 'Here is more content',
				},
			},
			[
				{
					label: 'Category to Skip',
					name: 'category-to-skip',
				},
				{
					label: 'Some Category',
					name: 'some-category',
				},
			],
			[
				{
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Some Category',
					name: 'some-category',
				},
				{
					label: 'Uncategorized',
					name: 'uncategorized',
				},
			],
		],
		[
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
					content: 'Here is some content',
					categories: [ 'some-category' ],
				},
				'third-pattern': {
					title: 'Third Pattern',
					name: 'third-pattern',
					slug: 'third-pattern',
					content: 'Here is more content',
					categories: [ 'third-category' ],
				},
				'fourth-pattern': {
					title: 'Fourth Pattern',
					name: 'fourth-pattern',
					slug: 'fourth-pattern',
					content: 'This is even more content',
					categories: [ 'uncategorized' ],
				},
				'fifth-pattern': {
					title: 'Fifth Pattern',
					name: 'fifth-pattern',
					slug: 'fifth-pattern',
					content: "Wow. That's a lot of content!",
				},
			},
			[
				{
					label: 'Another Category',
					name: 'another-category',
				},
				{
					label: 'Some Category',
					name: 'some-category',
				},
				{
					label: 'Third Category',
					name: 'third-category',
				},
				{
					label: 'Fourth Category',
					name: 'fourth-category',
				},
			],
			[
				{
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Some Category',
					name: 'some-category',
				},
				{
					label: 'Third Category',
					name: 'third-category',
				},
				{
					label: 'Uncategorized',
					name: 'uncategorized',
				},
			],
		],
	] )(
		'should return unique pattern categories',
		( patterns: Patterns, queriedCategories, expected: { label: string; name: string }[] ) => {
			expect( getUniquePatternCategories( patterns, queriedCategories ) ).toEqual(
				expected
			);
		}
	);
} );
