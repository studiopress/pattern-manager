import getSelectedOptions from '../getSelectedOptions';

type Option = { label: string; value: string };

describe( 'getSelectedOptions', () => {
	it.each< [ string[], Option[], keyof Option, Option[] ] >( [
		[ [], [], 'value', [] ],
		[
			[],
			[
				{
					label: 'Some Option',
					value: 'some-option',
				},
			],
			'value',
			[],
		],
		[
			[ 'missing-option' ],
			[
				{
					label: 'Some Option',
					value: 'some-option',
				},
			],
			'value',
			[],
		],
		[
			[ 'found-option' ],
			[
				{
					label: 'Found Option',
					value: 'found-option',
				},
			],
			'value',
			[
				{
					label: 'Found Option',
					value: 'found-option',
				},
			],
		],
		[
			[ 'some-option', 'another-option' ],
			[
				{
					label: 'Some Option',
					value: 'some-option',
				},
				{
					label: 'Another Option',
					value: 'another-option',
				},
				{
					label: 'Third Option',
					value: 'third-option',
				},
				{
					label: 'Fourth Option',
					value: 'fourth-option',
				},
			],
			'value',
			[
				{
					label: 'Some Option',
					value: 'some-option',
				},
				{
					label: 'Another Option',
					value: 'another-option',
				},
			],
		],
		[
			[ 'duplicate-option', 'duplicate-option' ],
			[
				{
					label: 'Duplicate Option',
					value: 'duplicate-option',
				},
				{
					label: 'Another Option',
					value: 'another-option',
				},
			],
			'value',
			[
				{
					label: 'Duplicate Option',
					value: 'duplicate-option',
				},
			],
		],
		[
			[ 'Another Option' ],
			[
				{
					label: 'Some Option',
					value: 'some-option',
				},
				{
					label: 'Another Option',
					value: 'another-option',
				},
				{
					label: 'Third Option',
					value: 'third-option',
				},
			],
			'label', // Use a different optionKey.
			[
				{
					label: 'Another Option',
					value: 'another-option',
				},
			],
		],
		[
			[ 'Label that should match', 'value-that-should-not-be-matched' ],
			[
				{
					label: 'Some Option',
					value: 'some-option',
				},
				{
					label: 'Another Option',
					value: 'another-option',
				},
				{
					label: 'Label that should match',
					value: 'label-that-should-match',
				},
				{
					label: 'Value that should not be matched',
					value: 'value-that-should-not-be-matched',
				},
			],
			'label',
			[
				{
					label: 'Label that should match',
					value: 'label-that-should-match',
				},
			],
		],
	] )(
		'should return an array of options that correspond with the list of selections',
		( selections, availableOptions, optionKey, expected ) => {
			expect(
				getSelectedOptions( selections, availableOptions, optionKey )
			).toEqual( expect.arrayContaining( expected ) );
		}
	);
} );
