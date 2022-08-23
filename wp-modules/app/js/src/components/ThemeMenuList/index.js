// @ts-check

import React from 'react';
import useStudioContext from '../../hooks/useStudioContext';

export default function ThemeMenuList() {
	const { currentTheme, themes, currentThemeId } = useStudioContext();

	const listMenuOptions = ( items ) => {
		return Object.keys( items ).map( ( key ) => (
			<li key={ key }>
				<button
					type="button"
					onClick={ () => {
						currentThemeId?.set( key );
					} }
				>
					{ items[ key ].name }
				</button>
			</li>
		) );
	};

	return (
		// In order to render the selector…
		// There should be at least 1 theme other than the currently selected theme.
		// Or the current theme should have been saved to disk.
		Object.keys( themes?.themes || {} ).some(
			( themeName ) =>
				themeName !== currentThemeId?.value ||
				currentTheme?.existsOnDisk
		) ? (
			<ul className="dropdown" aria-label="submenu">
				{ listMenuOptions( themes?.themes ) }
			</ul>
		) : null
	);
}
