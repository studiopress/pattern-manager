// @ts-check

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import MultiCheckbox from '../MultiCheckbox';

describe( 'MultiCheckbox', () => {
	render( <MultiCheckbox /> );

    it.each( [
        'px',
        'em',
        'rem',
        'vh',
        'vw',
        '%'
    ] )( 'should render the checkbox', ( unit ) => {
        expect( screen.getByRole('checkbox', { name: unit }) ).toBeInTheDocument();
	} );
} );
