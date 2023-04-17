/**
 * Internal dependencies
 */
import convertBlocksToTemplate from '../convertBlocksToTemplate';

describe( 'convertBlocksToTemplate', () => {
	it.each( [
		[ [], [] ],
		[
			[ { name: 'Foo', attributes: { bar: '' } } ],
			[ [ 'Foo', { bar: '' }, [] ] ],
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
			[ [ 'Foo', { bar: '' }, [ [ 'Bar', { example: '' }, [] ] ] ] ],
		],
	] )( 'should convert blocks', ( blocks, expected ) => {
		expect( convertBlocksToTemplate( blocks ) ).toEqual( expected );
	} );
} );
