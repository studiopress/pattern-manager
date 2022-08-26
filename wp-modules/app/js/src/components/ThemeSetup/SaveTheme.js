import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import { useEffect } from 'react';

import useStudioContext from '../../hooks/useStudioContext';

/** @param {{displayCancelButton: boolean, setDisplayThemeCreatedNotice: (boolean) => void}} props */
export default function SaveTheme( {
	displayCancelButton,
	setDisplayThemeCreatedNotice,
} ) {
	const { currentTheme, currentThemeId, themes, currentView } =
		useStudioContext();

	return 'create_theme' === currentView.currentView &&
		! currentTheme.isSaving ? (
		<div className="py-5 text-xl flex items-center sticky bottom-0 bg-[rgba(255,255,255,.8)] backdrop-blur-sm">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center">
					<button
						type="button"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
						onClick={ () => {
							if ( ! currentTheme.existsOnDisk ) {
								setDisplayThemeCreatedNotice( true );
							}

							currentTheme.save();
						} }
					>
						{ __( 'Save Your Theme', 'fse-studio' ) }
					</button>
					{ displayCancelButton &&
					! currentTheme?.existsOnDisk &&
					Object.keys( themes.themes ).length > 1 ? (
						<button
							type="button"
							className="inline-flex items-center ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => {
								const {
									[ currentThemeId.value ]: {},
									...modifiedThemes
								} = themes.themes;
								themes.setThemes( modifiedThemes );

								currentThemeId.set(
									Object.keys( themes.themes )[ 0 ]
								);

								setDisplayThemeCreatedNotice( false );

								currentView?.set( 'theme_setup' );
							} }
						>
							{ __( 'Cancel', 'fse-studio' ) }
						</button>
					) : null }
				</div>
			</div>
		</div>
	) : (
		<Spinner className="mt-5 mx-0 h-10 w-10" />
	);
}
