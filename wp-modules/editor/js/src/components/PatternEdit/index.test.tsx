import { render } from '@testing-library/react';
import PatternEdit from './';

jest.mock( '../../globals', () => {
	return {
		patternManager: {
			patterns: {
				'foo-pattern': {
					content:
						'<!-- wp:paragraph --><p>Here is content!</p><!-- /wp:paragraph -->',
					editorLink: 'https://example.com',
					name: 'foo-pattern',
					slug: 'foo-pattern',
					title: 'Foo Pattern',
				},
			},
		},
	};
} );

jest.mock( '@wordpress/block-editor', () => {
	return {
		...jest.requireActual( '@wordpress/block-editor' ),
		InspectorControls: () => null,
		useBlockProps: () => ( {} ),
	};
} );

describe( 'PatternEdit', () => {
	beforeAll( () => {
		window.ResizeObserver = class {
			observe() {}
			unobserve() {}
		};
	} );

	afterAll( () => {
		jest.restoreAllMocks();
	} );

	it( 'prompts to select a pattern', () => {
		const { getByText } = render(
			<PatternEdit attributes={ {} } setAttributes={ () => {} } />
		);

		getByText( 'Select a Pattern' );
	} );

	it( 'should not prompt to select a pattern when one is selected', () => {
		const { queryByText } = render(
			<PatternEdit
				attributes={ { slug: 'foo-pattern' } }
				setAttributes={ () => {} }
			/>
		);

		expect( queryByText( 'Select a Pattern' ) ).toBeFalsy();
	} );
} );
