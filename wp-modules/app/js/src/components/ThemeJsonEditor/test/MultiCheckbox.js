// @ts-check

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import MultiCheckbox from '../MultiCheckbox';

test( 'MultiCheckbox', async () => {
	render( <MultiCheckbox /> );
	const pxUnitName = 'px unit';
	const remUnitName = 'rem unit';

	expect( screen.getByLabelText( pxUnitName ) ).toBeInTheDocument();
	expect( screen.getByLabelText( remUnitName ) ).toBeInTheDocument();
} );
