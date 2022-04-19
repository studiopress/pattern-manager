// @ts-check

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import MultiCheckbox from '../MultiCheckbox';

describe( 'MultiCheckbox', () => {
	const units = [ 'px', 'em', 'rem', 'vh', 'vw', '%' ];
	render( <MultiCheckbox value={ units } onChange={ () => {} } /> );

	it.each( units )( 'should render the checkbox', ( unit ) => {
		const checkbox = screen.getByRole( 'checkbox', { name: unit } );
		expect( checkbox.checked ).toEqual( true );
	} );
} );
