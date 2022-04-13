// @ts-check

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import FseStudioHelp from '../';

describe( 'FseStudioHelp', () => {
	it( 'should have the right heading', () => {
		render( <FseStudioHelp visible={ true } /> );

		expect(
			screen.getByText( /welcome to fse studio/i )
		).toBeInTheDocument();
	} );
} );
