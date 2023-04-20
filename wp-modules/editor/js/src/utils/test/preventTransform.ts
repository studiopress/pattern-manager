/**
 * Internal dependencies
 */
import preventTransform from '../preventTransform';

describe( 'preventTransform', () => {
	it.each( [
		[
			{ name: 'core/paragraph' },
			'core/paragraph',
			{ name: 'core/paragraph' },
		],
		[
			{
				name: 'core/heading',
				transforms: [ { from: {} } ],
			},
			'core/heading',
			{
				name: 'core/heading',
				transforms: [ { from: {} } ],
			},
		],
	] )( 'returns other blocks as passed', ( settings, name, expected ) => {
		expect( preventTransform( settings, name ) ).toEqual( expected );
	} );

	it( 'handles a correct block with no transform', () => {
		const actual = preventTransform(
			{
				name: 'core/columns',
				transforms: {},
			},
			'core/columns'
		);

		expect( actual ).toEqual( {
			name: 'core/columns',
			transforms: {},
		} );
	} );

	it( 'does not override a typical transform', () => {
		const actual = preventTransform(
			{
				name: 'core/columns',
				transforms: {
					from: [
						{
							type: 'block',
							blocks: [ 'core/media-text' ],
							isMatch: () => true,
						},
					],
				},
			},
			'core/columns'
		);

		const { isMatch } = actual.transforms.from[ 0 ];

		expect( isMatch( {}, [] ) ).toBe( true );
		expect(
			isMatch( {}, [
				{ name: 'core/pattern', attributes: { slug: 'example' } },
			] )
		).toBe( true );
	} );

	it( 'overrides a wildcard transform for a pattern block', () => {
		const actual = preventTransform(
			{
				name: 'core/columns',
				transforms: {
					from: [
						{
							type: 'block',
							blocks: [ '*' ],
							isMatch: () => true,
						},
					],
				},
			},
			'core/columns'
		);

		const { isMatch } = actual.transforms.from[ 0 ];

		expect( isMatch( {}, [] ) ).toBe( true );
		expect(
			isMatch( {}, [
				{ name: 'core/paragraph', attributes: { align: 'center' } },
			] )
		).toBe( true );
		expect(
			isMatch( {}, [
				{ name: 'core/pattern', attributes: { slug: 'example' } },
			] )
		).toBe( false );
	} );
} );
