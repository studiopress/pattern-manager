/**
 * Internal dependencies
 */
import getUniquePatternCategories from '../getUniquePatternCategories';
import type { Patterns } from '../../types';

describe( 'getUniquePatternCategories', () => {
	it.each< [ Patterns, { label: string; name: string }[] ] >( [
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
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Some category',
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
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Some category',
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
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Another category',
					name: 'another-category',
				},
				{
					label: 'Some category',
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
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Some category',
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
					label: 'All Patterns',
					name: 'all-patterns',
				},
				{
					label: 'Some category',
					name: 'some-category',
				},
				{
					label: 'Third category',
					name: 'third-category',
				},
				{
					label: 'Uncategorized',
					name: 'uncategorized',
				},
			],
		],
	] )( 'should return unique pattern categories', ( patterns, expected ) => {
		expect( getUniquePatternCategories( patterns ) ).toEqual( expected );
	} );
} );
