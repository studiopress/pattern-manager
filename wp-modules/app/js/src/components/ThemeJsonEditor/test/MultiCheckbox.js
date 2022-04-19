// @ts-check

import { useState } from '@wordpress/element';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import MultiCheckbox from '../MultiCheckbox';

describe( 'MultiCheckbox', () => {
	const units = [ 'px', 'em', 'rem', 'vh', 'vw', '%' ];
	const [ checkboxValue, setCheckboxValue ] = useState( units );

	render(
		<MultiCheckbox value={ checkboxValue } onChange={ setCheckboxValue } />
	);

	it.each( units )( 'should render the checkbox', ( unit ) => {
		expect(
			screen.getByRole( 'checkbox', { name: unit } ).checked
		).toEqual( true );
	} );

	const checkbox = screen.getByRole( 'checkbox', { name: 'px' } );
	fireEvent.click( checkbox );
	expect( checkbox.checked ).toEqual( false );
} );
