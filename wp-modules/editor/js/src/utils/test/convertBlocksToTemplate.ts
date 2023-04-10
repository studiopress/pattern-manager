/**
 * Internal dependencies
 */
import convertBlocksToTemplate from '../convertBlocksToTemplate';

describe( 'convertBlocksToTemplate', () => {
	it.each( [ [ [], [] ] ] )(
		'should convert blocks',
		( blocks, expected ) => {
			expect( convertParsedBlocksToBlockTemplate( blocks ) ).toEqual(
				expected
			);
		}
	);
} );
