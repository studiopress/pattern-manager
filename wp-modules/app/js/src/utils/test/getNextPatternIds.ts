/* eslint-disable no-undef */

import { Patterns } from '../../types';
import getNextPatternIds from '../getNextPatternIds';

type Expected = {
	patternNumber: number;
	patternTitle: string;
	patternSlug: string;
};

describe( 'getNextPatternIds', () => {
	it.each< [ {} | Patterns, Expected ] >( [
		[
			{},
			{
				patternNumber: 0,
				patternTitle: 'My New Pattern',
				patternSlug: 'my-new-pattern',
			},
		],
		[
			[], // Malformed shape, should be an object.
			{
				patternNumber: 0,
				patternTitle: 'My New Pattern',
				patternSlug: 'my-new-pattern',
			},
		],
		[
			{ pattern: { slug: null } },
			{
				patternNumber: 0,
				patternTitle: 'My New Pattern',
				patternSlug: 'my-new-pattern',
			},
		],
		[
			{ pattern: { slug: '' } },
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
		( patterns, expected ) => {
			expect( getNextPatternIds( patterns ) ).toEqual( expected );
		}
	);

	it.each< [ Patterns, Expected ] >( [
		[
			{
				pattern: {
					title: 'Abc Def',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
			},
			{
				patternNumber: 0,
				patternTitle: 'My New Pattern',
				patternSlug: 'my-new-pattern',
			},
		],
		[
			{
				pattern: {
					title: 'My New Pattern',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
			},
			{
				patternNumber: 1,
				patternTitle: 'My New Pattern 1',
				patternSlug: 'my-new-pattern-1',
			},
		],
		[
			{
				pattern: {
					title: 'My New Pattern 22',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
			},
			{
				patternNumber: 23,
				patternTitle: 'My New Pattern 23',
				patternSlug: 'my-new-pattern-23',
			},
		],
		[
			{
				pattern: {
					title: 'My New Pattern',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
				pattern1: {
					title: 'My New Pattern 2',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
				pattern2: {
					title: 'My New Pattern 3',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
			},
			{
				patternNumber: 4,
				patternTitle: 'My New Pattern 4',
				patternSlug: 'my-new-pattern-4',
			},
		],
		[
			{
				pattern: {
					title: 'My New Pattern',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
				pattern1: {
					title: 'My New Pattern 2',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
				pattern2: {
					title: 'Some Other Pattern 3',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
			},
			{
				patternNumber: 3,
				patternTitle: 'My New Pattern 3',
				patternSlug: 'my-new-pattern-3',
			},
		],
		[
			{
				pattern: {
					title: 'My New Pattern',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
				pattern1: {
					title: 'My New Pattern 2',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
				pattern2: {
					title: 'My New Pattern 3 1',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
			},
			{
				patternNumber: 3,
				patternTitle: 'My New Pattern 3',
				patternSlug: 'my-new-pattern-3',
			},
		],
		[
			{
				pattern: {
					title: 'My New Pattern',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
				pattern1: {
					title: 'My New Pattern 2',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
				pattern2: {
					title: 'My New Pattern 3',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
				pattern3: {
					title: 'My New Pattern 3 1',
					type: 'pattern',
					content: '',
					name: '',
					slug: '',
				},
			},
			{
				patternNumber: 4,
				patternTitle: 'My New Pattern 4',
				patternSlug: 'my-new-pattern-4',
			},
		],
	] )(
		'using title as field param, should return new pattern title and slug',
		( patterns, expected ) => {
			expect(
				getNextPatternIds( patterns, 'title', 'My New Pattern' )
			).toEqual( expected );
		}
	);

	it.each< [ Patterns, Expected ] >( [
		[
			{
				pattern: {
					slug: 'some-pattern-44',
					type: 'pattern',
					content: '',
					name: '',
					title: '',
				},
			},
			{
				patternNumber: 1,
				patternTitle: 'Some Pattern 44 1',
				patternSlug: 'some-pattern-44-1',
			},
		],
		[
			{
				pattern: {
					slug: 'some-pattern',
					type: 'pattern',
					content: '',
					name: '',
					title: '',
				},
				pattern1: {
					slug: 'some-pattern-44',
					type: 'pattern',
					content: '',
					name: '',
					title: '',
				},
			},
			{
				patternNumber: 1,
				patternTitle: 'Some Pattern 44 1',
				patternSlug: 'some-pattern-44-1',
			},
		],
		[
			{
				pattern: {
					slug: 'some-pattern-44',
					type: 'pattern',
					content: '',
					name: '',
					title: '',
				},
				pattern1: {
					slug: 'some-pattern-44-1',
					type: 'pattern',
					content: '',
					name: '',
					title: '',
				},
				pattern2: {
					slug: 'some-pattern-44-2',
					type: 'pattern',
					content: '',
					name: '',
					title: '',
				},
			},
			{
				patternNumber: 3,
				patternTitle: 'Some Pattern 44 3',
				patternSlug: 'some-pattern-44-3',
			},
		],
	] )(
		'using custom base param, should return new pattern title and slug',
		( patterns, expected ) => {
			expect(
				getNextPatternIds( patterns, 'slug', 'some-pattern-44' )
			).toEqual( expected );
		}
	);
} );
