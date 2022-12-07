import {
	getNestedValue,
	setNestedObject,
	_validateObjectLevel,
} from '../nestedObjectUtility';

describe( 'getNestedValue', () => {
	it.each( [
		// Order is: object, keys, expected.
		[ [ {} ], [ 0, 'a' ], undefined ],
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
	] )( 'should return a deeply nested value', ( object, keys, expected ) => {
		expect( getNestedValue( object, keys ) ).toEqual( expected );
	} );
} );

describe( 'setNestedObject', () => {
	it.each( [
		// Order is: value, defaultValue, keys, object, expected.
		[ 'newValue', null, [ 'a' ], { a: 'staleValue' }, { a: 'newValue' } ],
		[ false, null, [ 'a', 'b' ], { a: { b: {} } }, { a: { b: false } } ],
		[ false, false, [ 'a', 'b' ], { a: { b: {} } }, { a: {} } ],
		[ null, null, [ 'a', 'b' ], { a: { b: {} } }, { a: {} } ],
		[
			'newValue',
			null,
			[ 'a', 'b', 0 ],
			{ a: { b: {} } },
			{ a: { b: [ 'newValue' ] } },
		],
		[
			null,
			null,
			[ 'a', 'b', 0 ],
			{ a: { b: [ 'toDelete' ] } },
			{ a: { b: [] } },
		],
		[
			null,
			null,
			[ 'a', 'b', '1' ],
			{ a: { b: [ 'toRemain', 'toDelete' ] } },
			{ a: { b: [ 'toRemain' ] } },
		],
		[
			'matchesDefaultValue',
			'matchesDefaultValue',
			[ 'a', 'b', '1' ],
			{ a: { b: [ 'toRemain', 'toDelete' ] } },
			{ a: { b: [ 'toRemain' ] } },
		],
		[
			'newValue',
			null,
			[ 'a', 'b', '0', 'c', 'd', 4, 'e' ],
			{
				someKey: false,
				a: {
					b: [
						{
							c: {
								d: [
									null,
									true,
									'random',
									{},
									{
										e: 'stalevalue',
									},
								],
							},
						},
					],
				},
			},
			{
				someKey: false,
				a: {
					b: [
						{
							c: {
								d: [
									null,
									true,
									'random',
									{},
									{
										e: 'newValue',
									},
								],
							},
						},
					],
				},
			},
		],
		[
			'newValue',
			null,
			[ 'a', 'b', '0', 'c' ],
			{}, // Start from empty object.
			{
				a: {
					b: [ { c: 'newValue' } ],
				},
			},
		],
		[
			{
				name: 'New Duotone',
				slug: 'new-duotone',
				color: [],
			},
			null,
			[ 'settings', 'color', 'duotone', '0' ],
			{
				version: 2,
				settings: {}, // Start from almost empty theme.json schema.
			},
			{
				version: 2,
				settings: {
					color: {
						duotone: [
							{
								name: 'New Duotone',
								slug: 'new-duotone',
								color: [],
							},
						],
					},
				},
			},
		],
		[
			{
				name: 'New Color',
				slug: 'new-color',
				color: '#ffffff',
			},
			null,
			[ 'settings', 'color', 'palette', '0' ],
			{
				version: 2,
				settings: {
					color: {}, // Add a level — previously failing before _validateObjectLevel.
				},
			},
			{
				version: 2,
				settings: {
					color: {
						palette: [
							{
								name: 'New Color',
								slug: 'new-color',
								color: '#ffffff',
							},
						],
					},
				},
			},
		],
		[
			{
				name: 'New Color',
				slug: 'new-color',
				color: '#ffffff',
			},
			null,
			[ 'settings', 'color', 'palette', '0' ],
			{
				version: 2,
				settings: {
					color: {
						palette: {}, // Malformed shape — should be an array. _validateObjectLevel will update.
						custom: false,
						duotone: [
							{
								name: '1',
								slug: '1',
								colors: [],
							},
							{
								name: '3',
								slug: '3',
								colors: [],
							},
							{
								name: '4',
								slug: '4',
								colors: [],
							},
						],
					},
				},
			},
			{
				version: 2,
				settings: {
					color: {
						palette: [
							{
								name: 'New Color',
								slug: 'new-color',
								color: '#ffffff',
							},
						],
						custom: false,
						duotone: [
							{
								name: '1',
								slug: '1',
								colors: [],
							},
							{
								name: '3',
								slug: '3',
								colors: [],
							},
							{
								name: '4',
								slug: '4',
								colors: [],
							},
						],
					},
				},
			},
		],
	] )(
		'should update a deeply nested value',
		( value, defaultValue, keys, object, newObject ) => {
			expect(
				setNestedObject( value, defaultValue, keys )( object )
			).toStrictEqual( newObject );
		}
	);

	it.each( [
		[ 'newValue', null, [ 'a' ], { a: 'staleValue' }, { a: 'staleValue' } ],
		[ false, null, [ 'a', 'b' ], { a: { b: {} } }, { a: { b: {} } } ],
		[ null, null, [ 'a', 'b' ], { a: { b: {} } }, { a: { b: {} } } ],
	] )(
		'should update a deeply nested value',
		( value, defaultValue, keys, object, expected ) => {
			expect(
				setNestedObject( value, defaultValue, keys )( object )
			).not.toStrictEqual( expected );
		}
	);
} );

describe( 'integration', () => {
	const keys = [ 'a', 'b' ];
	const newValue = 'new';
	expect(
		getNestedValue(
			setNestedObject(
				newValue,
				'defaultValue',
				keys
			)( { a: { b: 'stale' } } ),
			keys
		)
	).toEqual( newValue );
} );

describe( '_validateObjectLevel', () => {
	it.each( [
		// Order is: object, key, expected.
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
