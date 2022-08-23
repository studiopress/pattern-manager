import { __ } from '@wordpress/i18n';
import { check, Icon } from '@wordpress/icons';
import useStudioContext from '../../hooks/useStudioContext';

/** @param {{displayCancelButton: boolean}} props */
export default function SaveTheme( { displayCancelButton } ) {
	const { currentTheme, currentThemeId, themes } = useStudioContext();

	return (
		<div className="py-5 text-xl flex items-center sticky bottom-0 bg-[rgba(255,255,255,.8)] backdrop-blur-sm">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center">
					{ currentTheme.hasSaved ? (
						<span className="text-sm text-green-600 flex flex-row items-center mr-6">
							<Icon
								className="fill-current"
								icon={ check }
								size={ 26 }
							/>{ ' ' }
							{ __( 'Settings Saved!', 'fse-studio' ) }
						</span>
					) : null }
					<button
						type="button"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
						onClick={ () => {
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
