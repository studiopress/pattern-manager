import { getNestedValue, _validateObjectLevel } from '../nestedObjectUtility';

describe( 'getNestedValue', () => {
	it.each( [
		[ [ { a: 'nestedValue' } ], [ 0, 'a' ], 'nestedValue' ],
		[ { a: { b: [ 'nestedValue' ] } }, [ 'a', 'b', 0 ], 'nestedValue' ],
		[
			{ a: { b: [ true, 33, 'nestedValue' ] } },
			[ 'a', 'b', '2' ],
			'nestedValue',
		],
		[
			{
				a: {
					b: [
						true,
						{},
						{
							c: [ { d: 'nestedValue' }, false, 1, 2, {}, 3, 4 ],
							e: 'anotherString',
							f: {
								g: [],
							},
						},
					],
				},
			},
			[ 'a', 'b', '2', 'c', 0, 'd' ],
			'nestedValue',
		],
	] )( 'should return a deeply nested value', ( object, keys, value ) => {
		expect( getNestedValue( object, keys, value ) ).toEqual( value );
	} );
} );

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
