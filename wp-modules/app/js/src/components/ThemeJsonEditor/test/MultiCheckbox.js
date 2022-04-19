// @ts-check

import { useState } from '@wordpress/element';
import { fireEvent, render, screen } from '@testing-library/react';
import MultiCheckbox from '../MultiCheckbox';

function Container( { initialValue } ) {
	const [ checkboxValue, setCheckboxValue ] = useState( initialValue );

	return <MultiCheckbox
		value={ checkboxValue }
		onChange={ setCheckboxValue }
	/>;
}

describe( 'MultiCheckbox', () => {
	const units = [ 'px', 'em', 'rem', 'vh', 'vw', '%' ];

	it.each( units )( 'should have checked checkboxes', ( unit ) => {
        render( <Container initialValue={ units } /> );

		expect( screen.getByLabelText( unit ).checked ).toEqual( true );
	} );

    it( 'should handle unchecking', () => {
        render( <Container initialValue={ units } /> );

        const checkbox = screen.getByLabelText( 'px' );
        fireEvent.click( checkbox );
        expect( checkbox.checked ).toEqual( false );
    } );
} );
