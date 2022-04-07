// @ts-check

import '@testing-library/jest-dom/extend-expect';
import { act, render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import FseStudioApp from '../';

const getThemeEndpoint = 'https://example.com/get-theme';
const saveThemeEndpoint = 'https://example.com/save-theme';
const getThemeJsonFileEndpoint = 'https://example.com/get-themejson-file';
const themeSavedMessage = 'Theme successfully saved to disk';

jest.mock( '../../../globals', () => {
	return {
		fsestudio: {
			themes: {},
			apiEndpoints: {
				getThemeEndpoint,
				getThemeJsonFileEndpoint,
				saveThemeEndpoint,
			},
			initialTheme: '',
		},
	};
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
	expect( screen.queryByText( /choose a theme/i ) ).not.toBeInTheDocument();

	// The Pattern Editor tab shouldn't be present, as there's no theme saved.
	expect(
		screen.queryByRole( 'button', {
			name: /pattern editor/i,
		} )
	).not.toBeInTheDocument();

	await act( async () => {
		user.click(
			screen.getByRole( 'button', {
				name: /create a new theme/i,
			} )
		);

		user.type(
			await screen.findByRole( 'textbox', {
				name: /theme name/i,
			} ),
			'Longer Theme Name'
		);

		user.click(
			screen.getByRole( 'button', {
				name: /save theme settings/i,
			} )
		);
	} );

	screen.getAllByText( themeSavedMessage );

	// The Pattern Editor tab should now be present.
	expect(
		screen.queryByRole( 'button', {
			name: /pattern editor/i,
		} )
	).toBeInTheDocument();
} );
