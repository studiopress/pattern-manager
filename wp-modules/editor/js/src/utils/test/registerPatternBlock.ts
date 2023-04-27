/**
 * Internal dependencies
 */
import registerPatternBlock from '../registerPatternBlock';

describe( 'registerPatternBlock', () => {
	it( 'returns any other block as passed', () => {
		expect(
			registerPatternBlock( { name: 'core/paragraph' }, 'core/paragraph' )
		).toEqual( { name: 'core/paragraph' } );
	} );

	it( 'returns the PM Pattern Block instead of the core one', () => {
		const actual = registerPatternBlock(
			{ name: 'core/pattern' },
			'core/pattern'
		);
		expect( actual.title ).toBe( 'PM Pattern Block' );
		expect( actual.supports.inserter ).toBe( true );
	} );
} );
