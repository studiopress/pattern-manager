import { render } from '@testing-library/react';
import PatternEdit from './';

jest.mock( '../../globals', () => {
	return {
		patternManager: {
			patterns: {
				'foo-pattern': {
					content: 'Here is content',
					editorLink: 'https://example.com',
					name: 'foo-pattern',
					slug: 'foo-pattern',
					title: 'Foo Pattern',
				},
			},
		},
	};
} );

jest.mock( '@wordpress/block-editor/build/components/inner-blocks', () =>
	jest.fn( () => null )
);

jest.mock( '@wordpress/block-editor/build/components/inspector-controls', () =>
	jest.fn( () => null )
);

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

	it( 'displays the pattern when selected', () => {
		const { getAllByText } = render(
			<PatternEdit
				attributes={ { slug: 'foo-pattern' } }
				setAttributes={ () => {} }
			/>
		);

		getAllByText( 'Foo Pattern' );
	} );
} );