import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import FseStudioApp from '../';

window.fsestudio = {};

test( 'FseStudioApp', () => {
	render( <FseStudioApp /> );

	// When there is no theme saved, you shouldn't be able to choose a theme.
	expect( 
		screen.queryByText( /choose a theme/i )
	).not.toBeInTheDocument();

	// The Theme Manager tab should be present.
	expect( screen.getByRole( 'button', {
		name: /theme manager/i
	} ) ).toBeInTheDocument();

	// The Pattern Editor tab shouldn't be present, as there's no theme saved.
	expect( screen.queryByRole( 'button', {
		name: /pattern editor/i
	} ) ).not.toBeInTheDocument();

	user.click(
		screen.getByRole('button', { name: /create a new theme/i } )
	);

	expect( 
		getByText(/theme saved to your \/themes\/ folder/i )
	).toBeInTheDocument();
} );
