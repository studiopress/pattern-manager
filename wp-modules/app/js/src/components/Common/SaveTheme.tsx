/* eslint-disable no-undef */

import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

import useStudioContext from '../../hooks/useStudioContext';
import useNoticeContext from '../../hooks/useNoticeContext';

type Props = {
	displayCancelButton?: boolean;
};

export default function SaveTheme( { displayCancelButton }: Props ) {
	const { currentTheme, currentThemeId, themes, currentView } =
		useStudioContext();
	const { setDisplayThemeCreatedNotice } = useNoticeContext();

	return currentTheme.isSaving ? (
		<Spinner className="mt-5 mx-0 h-10 w-10" />
	) : (
		<div className="py-5 text-xl flex items-center sticky bottom-0 bg-[rgba(255,255,255,.8)] backdrop-blur-sm">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center">
					<button
						type="button"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
						onClick={ () => {
							currentTheme.save().then( () => {
								currentView.set( 'theme_setup' );
								setDisplayThemeCreatedNotice( true );
							} );
						} }
					>
						{ __( 'Save Theme', 'fse-studio' ) }
					</button>
					{ displayCancelButton &&
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

								currentView?.set( 'theme_setup' );
							} }
						>
							{ __( 'Cancel', 'fse-studio' ) }
						</button>
					) : null }
				</div>
			</div>
		</div>
	);
}
