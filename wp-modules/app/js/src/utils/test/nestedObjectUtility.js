import { _validateObjectLevel } from '../nestedObjectUtility';

describe( '_validateObjectLevel', () => {
	it.each( [
		[ undefined, 0, [] ],
		[ undefined, 'someKey', {} ],
		[ {}, 'someKey', {} ],
		[ [], 'someKey', {} ],
		[ [], 1, [] ],
		[ {}, 3, [] ],
		[ [ 'someValue' ], 0, [ 'someValue' ] ],
		[ [ 'someValue' ], 'someKey', [ 'someValue' ] ],
		[ { someKey: {} }, 'someKey', { someKey: {} } ],
		[ { someKey: false }, 'someKey', { someKey: false } ],
		[
			{ someKey: {}, keyToIgnore: true },
			'someKey',
			{ someKey: {}, keyToIgnore: true },
		],
	] )( 'should return the object or new shape', ( object, key, expected ) => {
		expect( _validateObjectLevel( object, key ) ).toEqual( expected );
	} );
} );
