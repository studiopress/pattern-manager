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

	it.each( units )( 'should have checked checkboxes', ( unit ) => {
		expect( screen.getByLabelText( unit ).checked ).toEqual( true );
	} );

	const checkbox = screen.getByLabelText( 'px' );
	fireEvent.click( checkbox );
	expect( checkbox.checked ).toEqual( false );
} );
