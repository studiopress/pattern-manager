import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import PatternManagerHelp from '..';

describe( 'PatternManagerHelp', () => {
	it( 'should have the right heading', () => {
		render( <PatternManagerHelp visible={ true } /> );

		expect(
			screen.getByText( /welcome to pattern manager/i )
		).toBeInTheDocument();
	} );
} );
