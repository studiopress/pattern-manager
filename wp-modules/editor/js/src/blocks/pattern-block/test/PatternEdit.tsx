import { render } from '@testing-library/react';
import PatternEdit from '../PatternEdit';

jest.mock( '../../../globals', () => {
	return {
		patternManager: {
			patterns: {
				'foo-pattern': {
					content:
						'<!-- wp:paragraph --><p>Here is content!</p><!-- /wp:paragraph -->',
					editorLink: 'https://example.com',
					filename: 'foo-pattern',
					slug: 'foo-pattern',
					title: 'Foo Pattern',
				},
			},
		},
	};
} );

jest.mock( '../../../hooks/useSavedPostData', () => {
	return () => ( {} );
} );

jest.mock( '../../../../../../app/js/src/components/PatternPreview', () => {
	return () => null;
} );

jest.mock( '@wordpress/block-editor', () => {
	return {
		...jest.requireActual( '@wordpress/block-editor' ),
		BlockControls: () => null,
		InspectorControls: () => null,
		useBlockProps: () => ( {} ),
	};
} );

jest.mock( '@wordpress/server-side-render', () => {
	return () => null;
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

		getByText( /select a pattern/i );
	} );

	it( 'should not prompt to select a pattern when one is selected', () => {
		const { queryByText } = render(
			<PatternEdit
				attributes={ { slug: 'foo-pattern' } }
				setAttributes={ () => {} }
			/>
		);

		expect( queryByText( /select a pattern/i ) ).toBeFalsy();
	} );
} );
