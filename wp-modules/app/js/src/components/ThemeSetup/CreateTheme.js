import { __ } from '@wordpress/i18n';
import useStudioContext from '../../hooks/useStudioContext';
import ThemeDetails from './ThemeDetails';

export default function CreateTheme( { children } ) {
	const { currentTheme } = useStudioContext();

	return (
		<div className="mx-auto p-8 lg:p-12">
			<form className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10 lg:gap-20">
				<div className="flex-initial w-full md:w-2/3">
					<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center pt-0">
						<label
							htmlFor="theme-name"
							className="block font-medium text-gray-700 sm:col-span-1"
						>
							{ __( 'Theme Name', 'fse-studio' ) }
						</label>
						<div className="mt-1 sm:mt-0 sm:col-span-2">
							<input
								disabled={
									currentTheme.existsOnDisk &&
									! currentTheme.themeNameIsDefault
								}
								className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
								type="text"
								id="theme-name"
								value={ currentTheme?.data?.name ?? '' }
								onChange={ ( event ) => {
									currentTheme.set( {
										...currentTheme.data,
										name: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<details className="mb-2 rounded-sm">
						<summary className="py-4 focus:outline-none border-b border-grey-300 w-full group">
							<h2 className="cursor-pointer group-focus-visible:text-wp-blue inline">
								{ __(
									'Additional Theme Details',
									'fse-studio'
								) }
							</h2>
						</summary>
						<ThemeDetails />
					</details>
					{ children }
				</div>
			</form>
		</div>
	);
}
