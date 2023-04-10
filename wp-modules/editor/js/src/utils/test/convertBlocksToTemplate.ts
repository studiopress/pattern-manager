/**
 * Internal dependencies
 */
import convertBlocksToTemplate from '../convertBlocksToTemplate';

describe( 'convertBlocksToTemplate', () => {
	it.each( [
		[ [], [] ],
		[
			[ { name: 'Foo', attributes: { bar: '' } } ],
			[ [ 'Foo', { bar: '' }, undefined ] ],
		],
		[
			[ { name: 'Foo', attributes: { bar: '' }, innerBlocks: [] } ],
			[ [ 'Foo', { bar: '' }, [] ] ],
		],
		[
			[
				{
					name: 'Foo',
					attributes: { bar: '' },
					innerBlocks: [
						{ name: 'Bar', attributes: { example: '' } },
					],
				},
			],
			[
				[
					'Foo',
					{ bar: '' },
					[ [ 'Bar', { example: '' }, undefined ] ],
				],
			],
		],
	] )( 'should convert blocks', ( blocks, expected ) => {
		expect( convertBlocksToTemplate( blocks ) ).toEqual( expected );
	} );
} );
