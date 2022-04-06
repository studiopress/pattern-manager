// @ts-check

import '@testing-library/jest-dom/extend-expect';
import { act, render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import FseStudioApp from '../';

const getThemeEndpoint = 'https://example.com/get-theme'
const saveThemeEndpoint = 'https://example.com/save-theme'
const getThemeJsonFileEndpoint = 'https://example.com/get-themejson-file'

const themeSavedMessage = 'Theme successfully saved to disk';

jest.mock( '../../../globals', () => {
	return { fsestudio: {
		themes: {},
		apiEndpoints: {
			getThemeEndpoint,
			getThemeJsonFileEndpoint,
			saveThemeEndpoint,
		},
		initialTheme: '',
	} };
} );

global.fetch = jest.fn( ( request ) => {
	return Promise.resolve( {
		ok: true,
    	json: () => {
			if ( request.toString().includes( getThemeEndpoint ) ) {
				return Promise.resolve( {
					name: 'default',
					content: {},
				} );
			}

			if ( request.includes( saveThemeEndpoint ) ) {
				return Promise.resolve( themeSavedMessage );
			}
		},
	} );
} );

beforeEach( () => {
  global.fetch.mockClear();
} );

test( 'FseStudioApp', async () => {
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

	await act( async () => {
		user.click(
			await screen.findByRole( 'button', { name: /create a new theme/i } )
		);
		user.click(
			await screen.findByRole( 'button', { name: /save theme settings/i } )
		);
	} );

	await screen.findAllByText( themeSavedMessage );
} );
