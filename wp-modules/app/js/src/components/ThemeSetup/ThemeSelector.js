import { __ } from '@wordpress/i18n';
import useStudioContext from '../../hooks/useStudioContext';

export default function ThemeSelector() {
	const { currentThemeId, themes } = useStudioContext();

	return (
		<select
			className="block w-full h-14 !pl-3 !pr-12 py-4 text-base !border-gray-300 !focus:outline-none !focus:ring-wp-blue !focus:border-wp-blue !sm:text-sm !rounded-sm"
			id="themes"
			value={ currentThemeId.value }
			onChange={ ( event ) => {
				currentThemeId.set( event.target.value );
			} }
		>
			<option key={ 1 }>{ __( 'Choose a theme', 'fse-studio' ) }</option>
			{ Object.keys( themes.themes ).map( ( themeId ) => {
				return (
					<option key={ themeId } value={ themeId }>
						{ themes.themes[ themeId ].name }
					</option>
				);
			} ) }
		</select>
	);
}
