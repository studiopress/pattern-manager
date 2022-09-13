import { __ } from '@wordpress/i18n';
import useStudioContext from '../../hooks/useStudioContext';

export default function ThemeDetails() {
	const { currentTheme } = useStudioContext();

	return (
		<>
			<div
				hidden
				className="sm:grid-cols-3 sm:gap-4 py-6 sm:items-center"
			>
				<label
					htmlFor="directory-name"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Directory Name', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="directory-name"
						value={ currentTheme?.data?.dirname ?? '' }
						disabled
					/>
				</div>
			</div>
			<div
				hidden
				className="sm:grid-cols-3 sm:gap-4 py-6 sm:items-center"
			>
				<label
					htmlFor="namespace"
					className="block font-medium text-gray-700 sm:col-span-1"
				>
					{ __( 'Namespace', 'fse-studio' ) }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue !border-gray-300 !rounded-md !h-10"
						type="text"
						id="namespace"
						value={ currentTheme?.data?.namespace ?? '' }
						disabled
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
						value={
							currentTheme?.data?.uri ? currentTheme.data.uri : ''
						}
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
						value={
							currentTheme?.data?.author
								? currentTheme.data.author
								: ''
						}
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
						value={
							currentTheme?.data?.description
								? currentTheme.data.description
								: ''
						}
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
						value={
							currentTheme?.data?.tags
								? currentTheme.data.tags
								: ''
						}
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
						value={
							currentTheme?.data?.tested_up_to
								? currentTheme.data.tested_up_to
								: ''
						}
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
						value={
							currentTheme?.data?.requires_wp
								? currentTheme.data.requires_wp
								: ''
						}
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
						value={
							currentTheme?.data?.requires_php
								? currentTheme.data.requires_php
								: ''
						}
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
						value={
							currentTheme?.data?.version
								? currentTheme.data.version
								: ''
						}
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
