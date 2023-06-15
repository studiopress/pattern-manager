import { checkIllegalChars, stripIllegalChars } from '../validateInput';

const regexPattern = new RegExp( /([^a-z0-9 -]+)/gi );

describe( 'validateInput', () => {
	describe( 'checkIllegalChars', () => {
		it.each( [
			[ '', null ],
			[ 'Nothing to strip', null ],
			[ 'String with !#@$%^&*() illegal chars', [ '!#@$%^&*()' ] ],
			[
				'String !#@$% with ^&*() separated \'"? illegal []{}|/ chars',
				[ '!#@$%', '^&*()', '\'"?', '[]{}|/' ],
			],
		] )( 'matches the illegal characters', ( input, expected ) => {
			expect( checkIllegalChars( input, regexPattern ) ).toEqual(
				expected
			);
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
