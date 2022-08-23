// @ts-check

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

// Context
import useStudioContext from '../../../hooks/useStudioContext';

// Images
// @ts-ignore
import dropMenuIconRight from '../../../../../img/drop-arrow-right.svg';

export default function MenuOpenTheme() {
	const { currentTheme, themes, currentThemeId } = useStudioContext();

	const listMenuOptions = ( items ) => {
		return Object.keys( items ).map( ( key ) => {
			const name =
				currentThemeId?.value === key
					? `${ items[ key ]?.name } (Active)`
					: items[ key ]?.name;

			return (
				<li key={ key }>
					<button
						type="button"
						onClick={ () => {
							currentThemeId?.set( key );
						} }
					>
						{ name }
					</button>
				</li>
			);
		} );
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
			<>
				<button
					aria-haspopup="true"
					className="flex justify-between items-center"
				>
					<span className="flex items-center gap-4">
						<svg
							width="13"
							height="10"
							viewBox="0 0 13 10"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M11.7812 1.875H6.90625L5.50977 0.503906C5.35742 0.351562 5.1543 0.25 4.92578 0.25H1.21875C0.533203 0.25 0 0.808594 0 1.46875V8.78125C0 9.4668 0.533203 10 1.21875 10H11.7812C12.4414 10 13 9.4668 13 8.78125V3.09375C13 2.43359 12.4414 1.875 11.7812 1.875ZM11.7812 8.78125H1.21875V1.46875H4.77344L6.14453 2.86523C6.29688 3.01758 6.5 3.09375 6.72852 3.09375H11.7812V8.78125Z"
								fill="#969696"
							/>
						</svg>
						{ __( 'Open Theme', 'fse-studio' ) }
					</span>
					<img
						alt="drop icon"
						className="ml-2"
						src={ dropMenuIconRight }
					/>
				</button>

				<ul className="dropdown" aria-label="submenu">
					{ listMenuOptions( themes?.themes ) }
				</ul>
			</>
		) : null
	);
}
