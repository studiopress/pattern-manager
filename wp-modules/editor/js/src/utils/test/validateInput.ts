import { hasIllegalChars, stripIllegalChars } from '../validateInput';

const regexPattern = new RegExp( /([^a-z0-9 -]+)/gi );

describe( 'validateInput', () => {
	describe( 'hasIllegalChars', () => {
		it.each( [
			[ '', false ],
			[ 'Nothing to strip', false ],
			[ "String that might've been a problem", true ],
			[ 'String with !#@$% illegal ^&*() chars', true ],
		] )( 'matches the illegal characters', ( input, expected ) => {
			expect( hasIllegalChars( input, regexPattern ) ).toBe( expected );
		} );
	} );
	describe( 'stripIllegalChars', () => {
		it.each( [
			[ '', '' ],
			[ 'Nothing to strip', 'Nothing to strip' ],
			[
				'String with !#@$%^&*() illegal chars',
				'String with  illegal chars',
			],
			[
				"This might've caused a whitescreen previously!",
				'This mightve caused a whitescreen previously',
			],
		] )( 'strips the illegal characters', ( input, expected ) => {
			expect( stripIllegalChars( input, regexPattern ) ).toBe( expected );
		} );
	} );
} );
