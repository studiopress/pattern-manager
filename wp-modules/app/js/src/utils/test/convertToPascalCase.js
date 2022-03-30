import convertToPascalCase from '../convertToPascalCase';

describe('convertToPascalCase', () => {
	it.each([
		[undefined, ''],
		['', ''],
		['word', 'Word'],
		['two words', 'TwoWords'],
		['here three words', 'HereThreeWords'],
		['with a number 6243', 'WithANumber6243'],
		['AlreadyPascalCase', 'AlreadyPascalCase'],
		['Many   Spaces', 'ManySpaces'],
		['initially_snake_case', 'InitiallySnakeCase'],
		['with&&&***non.,.word$$characters', 'WithNonWordCharacters'],
		['ending in apostrophe!', 'EndingInApostrophe'],
		['with 🥁emojis🏇', 'WithEmojis'],
	])('should convert to PascalCase', (toConvert, expected) => {
		expect(convertToPascalCase(toConvert)).toEqual(expected);
	});
});
