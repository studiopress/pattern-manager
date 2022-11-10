// @ts-check

/**
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

export default function createNewTheme(
	themes,
	currentThemeId,
	newThemeData = {}
) {
	const themeId = uuidv4();

	/** @type {Partial<import('../types').Theme>} */
	const defaultNewThemeData = {
		id: themeId,
		name: '',
		dirname: '',
		namespace: '',
		uri: '',
		author: '',
		author_uri: '',
		description: '',
		tags: '',
		tested_up_to: '',
		requires_wp: '5.9',
		requires_php: '7.3',
		version: '1.0.0',
		text_domain: 'my-new-theme',
		styles: {},
	};

	// Merge the default themeData with the passed-in themeData.
	newThemeData = {
		...defaultNewThemeData,
		...newThemeData,
	};

	themes.setThemes( {
		...themes.themes,
		[ themeId ]: newThemeData,
	} );

	// Switch to the newly created theme.
	currentThemeId.set( themeId );
}
