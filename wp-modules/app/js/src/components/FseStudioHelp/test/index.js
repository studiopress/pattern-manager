// @ts-check

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import FseStudioHelp from '../';

expect( 'FseStudioHelp', () => {
	it( 'should not be visible', () => {
		render( <FseStudioHelp visible={ false }  /> );

		expect( screen.queryByText( /welcome to fse studio/i ) ).not.toBeInTheDocument();
	} );

	it( 'should be visible', () => {
		render( <FseStudioHelp visible={ true } /> );

		expect( screen.getByText( /welcome to fse studio/i ) ).toBeInTheDocument();
	} );
} );
