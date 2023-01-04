import { __ } from '@wordpress/i18n';
import useStudioContext from '../../hooks/useStudioContext';

export default function ThemeDetails() {
	const { currentTheme } = useStudioContext();

	return (
		<>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="theme-name"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Theme Name', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
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
						required={true}
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="theme-directory-name"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Theme Directory Name', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="theme-directory-name"
						value={ currentTheme?.data?.dirname ?? '' }
						aria-invalid={ currentTheme.isDirnameTaken() }
						aria-describedby={
							currentTheme.isDirnameTaken() ? 'name-help' : null
						}
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								dirname: event.target.value,
							} );
						} }
						required={true}
					/>
					{ currentTheme.isDirnameTaken() ? (
						<span id="name-help" className="text-red-700 font-sm">
							{ __(
								'This theme directory name is taken in wp-content. If you save, it will overwrite your other theme.',
								'fse-studio'
							) }
						</span>
					) : null }
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="text-domain"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Text Domain', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="text-domain"
						value={ currentTheme?.data?.text_domain ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								text_domain: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="uri"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Theme URI', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="uri"
						value={ currentTheme?.data?.uri ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								uri: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="author"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Author', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="author"
						value={ currentTheme?.data?.author ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								author: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="author-uri"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Author URI', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="author-uri"
						value={ currentTheme?.data?.author_uri ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								author_uri: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="description"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Description', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="description"
						value={ currentTheme?.data?.description ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								description: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="tags"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Tags (comma separated)', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="tags"
						value={ currentTheme?.data?.tags ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								tags: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="tested"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Tested up to (WP Version)', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="tested"
						value={ currentTheme?.data?.tested_up_to ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								tested_up_to: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="minimum-wp"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Minimum WP Version', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="minimum-wp"
						value={ currentTheme?.data?.requires_wp ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								requires_wp: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="minimum-php"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Minimum PHP Version', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="minimum-php"
						value={ currentTheme?.data?.requires_php ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								requires_php: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor="version"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Version', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="version"
						value={ currentTheme?.data?.version ?? '' }
						onChange={ ( event ) => {
							currentTheme.set( {
								...currentTheme.data,
								version: event.target.value,
							} );
						} }
					/>
				</div>
			</div>
			<div
				hidden
				className="sm:grid-cols-3 sm:gap-4 py-6 sm:items-center"
			>
				<label
					htmlFor="text-domain"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Text Domain', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="text-domain"
						value={ currentTheme?.data?.text_domain ?? '' }
						disabled
					/>
				</div>
			</div>
		</>
	);
}
