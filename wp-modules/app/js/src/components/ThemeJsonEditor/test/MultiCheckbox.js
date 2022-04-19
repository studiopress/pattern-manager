// @ts-check

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import MultiCheckbox from '../MultiCheckbox';

test( 'MultiCheckbox', async () => {
	render( <MultiCheckbox /> );

	expect(
		screen.getByText( /this is a multicheckbox/i )
	).toBeInTheDocument();
} );
