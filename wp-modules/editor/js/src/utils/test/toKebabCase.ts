import toKebabCase from '../toKebabCase';

describe( 'toKebabCase', () => {
	it.each( [
		[ undefined, '' ],
		[ '', '' ],
		[ 'Example', 'example' ],
		[ 'Two Words', 'two-words' ],
		[ 'Has Three Words', 'has-three-words' ],
		[ 'Has A Number 34', 'has-a-number-34' ],
		[ 'PascalCaseExample', 'pascalcaseexample' ],
		[ 'Multiple   Spaces', 'multiple-spaces' ],
		[ 'snake_case', 'snake-case' ],
		[ 'with&&&***non.,.word$$characters', 'with-non-word-characters' ],
		[ 'EndingInApostrophe!', 'endinginapostrophe' ],
		[ 'With 🥁Emojis🏇', 'with-emojis' ],
	] )( 'should convert to kebab case', ( toConvert, expected ) => {
		expect( toKebabCase( toConvert ) ).toEqual( expected );
	} );
} );
