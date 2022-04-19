// @ts-check

import { useState } from '@wordpress/element';
import { fireEvent, render, screen } from '@testing-library/react';
import MultiCheckbox from '../MultiCheckbox';

function Container( { initialValue } ) {
	const [ checkboxValue, setCheckboxValue ] = useState( initialValue );

	return (
		<div>
			<MultiCheckbox
				value={ checkboxValue }
				onChange={ setCheckboxValue }
			/>
		</div>
	);
}

describe( 'MultiCheckbox', () => {
	const units = [ 'px', 'em', 'rem', 'vh', 'vw', '%' ];

	render( <Container initialValue={ units } /> );

	it.each( units )( 'should render the checkbox', ( unit ) => {
		expect(
			screen.getByRole( 'checkbox', { name: unit } ).checked
		).toEqual( true );
	} );

	const checkbox = screen.getByRole( 'checkbox', { name: 'px' } );
	fireEvent.click( checkbox );
	expect( checkbox.checked ).toEqual( false );
} );
