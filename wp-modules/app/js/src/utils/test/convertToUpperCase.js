import convertToUpperCase from '../convertToUpperCase';

describe( 'convertToUpperCase', () => {
	it.each( [
		[ undefined, '' ],
		[ '', '' ],
		[ 'example', 'Example' ],
		[ 'twoWords', 'Two Words' ],
		[ 'andThreeWords', 'And Three Words' ],
		[ 'Already Upper Case', 'Already Upper Case' ],
	] )( 'should convert to Upper Case', ( toConvert, expected ) => {
		expect( convertToUpperCase( toConvert ) ).toEqual( expected );
	} );
} );
