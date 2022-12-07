import convertToCssClass from '../convertToCssClass';

describe( 'convertToCssClass', () => {
	it.each( [
		[ undefined, '' ],
		[ '', '' ],
		[ 'Word', 'word' ],
		[ 'TwoWords', 'two-words' ],
		[ 'HereThreeWords', 'here-three-words' ],
		[ 'withANumber6243', 'with-a-number-6243' ],
		[ 'already-css-class', 'already-css-class' ],
		[ 'Has.a-period', 'has-a-period' ],
	] )( 'should convert to CssClass', ( toConvert, expected ) => {
		expect( convertToCssClass( toConvert ) ).toEqual( expected );
	} );
} );
