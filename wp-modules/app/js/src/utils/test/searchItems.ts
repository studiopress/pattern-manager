import searchItems from '../searchItems';

describe( 'searchItems', () => {
	it.each( [
		[ [], '', {}, [] ],
		[ [], 'Here is a search', {}, [] ],
		[
			[
				{ title: 'Footer with text, links' },
				{ title: 'Header with site title, navigation' },
			],
			'Footer with text, links',
			{},
			[ { title: 'Footer with text, links' } ],
		],
		[
			[
				{ title: 'Footer with text, links' },
				{ title: 'Header with site title, navigation' },
			],
			'Footer',
			{},
			[ { title: 'Footer with text, links' } ],
		],
		[
			[
				{ title: 'Footer with text, links', name: 'Social' },
				{ title: 'Header with site title, navigation' },
			],
			'Social',
			{},
			[ { title: 'Footer with text, links', name: 'Social' } ],
		],
	] )(
		'should find the item where it exists',
		( items, searchInput, config, expected ) => {
			expect( searchItems( items, searchInput, config ) ).toEqual(
				expected
			);
		}
	);
} );
