import convertToPascalCase from '../convertToPascalCase';

 describe( 'convertToPascalCase', () => {
     it.each( [
         [
             'word',
             'Word',
         ],
         [
             'two words',
             'TwoWords',
         ],
         [
             'here three words',
             'HereThreeWords',
         ],
         [
             'with a number 6243',
             'WithANumber6243',
         ],
         [
             'AlreadyPascalCase',
             'AlreadyPascalCase',
         ],
         [
             'Many   Spaces',
             'ManySpaces',
         ],
         [
             'initially_snake_case',
             'InitiallySnakeCase',
         ],
     ] )( 'should convert to the PascalCase',
         ( toConvert, expected ) => {
             expect( convertToPascalCase( toConvert ) ).toEqual( expected );
         }
     );
 } );
