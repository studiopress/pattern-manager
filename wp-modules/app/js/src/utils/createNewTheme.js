// @ts-check

/**
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

export default function createNewTheme( themes, currentThemeId ) {
	const themeId = uuidv4();

	/** @type {import('../hooks/useThemeData').Theme} */
	const newThemeData = {
		id: themeId,
		name: 'My New Theme',
		dirname: 'my-new-theme',
		namespace: 'MyNewTheme',
		uri: 'mysite.com',
		author: 'Me',
		author_uri: 'mysite.com',
		description: 'My new FSE Theme',
		tags: '',
		tested_up_to: '5.9',
		requires_wp: '5.9',
		requires_php: '7.3',
		version: '1.0.0',
		text_domain: 'my-new-theme',
	};

	themes.setThemes( {
		...themes.themes,
		[ themeId ]: newThemeData,
	} );

	// Switch to the newly created theme.
	currentThemeId.set( themeId );
}
