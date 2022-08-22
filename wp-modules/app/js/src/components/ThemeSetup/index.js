// WP Dependencies.
import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, check } from '@wordpress/icons';

import useStudioContext from '../../hooks/useStudioContext';
import createNewTheme from '../../utils/createNewTheme';

import imgThemeTemplate from '../../../../img/theme-templates.svg';
import imgThemeTemplateParts from '../../../../img/theme-template-parts.svg';
import imgThemePatterns from '../../../../img/theme-patterns.svg';
import imgThemeJson from '../../../../img/theme-themejson.svg';
import imgThemeStyleVariations from '../../../../img/theme-style-variations.svg';
import imgThemeExport from '../../../../img/theme-export.svg';

/** @param {{isVisible: boolean}} props */
export default function ThemeSetup( { isVisible } ) {
	const { currentTheme, themes, currentThemeId, currentView } =
		useStudioContext();
	const themeNameInput = useRef( null );

	if ( ! currentTheme.data ) {
		return '';
	}

	function renderThemeSelector() {
		const renderedThemes = [];

		renderedThemes.push(
			<option key={ 1 }>{ __( 'Choose a theme', 'fse-studio' ) }</option>
		);

		let counter = 3;

		for ( const thisTheme in themes.themes ) {
			const themeInQuestion = themes.themes[ thisTheme ];
			renderedThemes.push(
				<option key={ counter } value={ thisTheme }>
					{ themeInQuestion?.name }
				</option>
			);
			counter++;
		}

		return (
			<>
				<select
					className="block w-full h-14 !pl-3 !pr-12 py-4 text-base !border-gray-300 !focus:outline-none !focus:ring-wp-blue !focus:border-wp-blue !sm:text-sm !rounded-sm"
					id="themes"
					value={ currentThemeId.value }
					onChange={ ( event ) => {
						currentThemeId.set( event.target.value );
					} }
				>
					{ renderedThemes }
				</select>
			</>
		);
	}

	return (
		<div hidden={ ! isVisible } className="flex-1">
			<div className="bg-fses-gray mx-auto p-8 lg:p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">
						{ currentTheme?.existsOnDisk
							? __( 'Theme: ', 'fse-studio' ) +
									currentTheme?.data?.name ?? ''
							: __( 'Create Your Theme', 'fse-studio' ) }
					</h1>
					<p className="text-lg max-w-2xl">
						{ currentTheme?.existsOnDisk
							? __(
									'Here you will find everything you need to customize your full-site editing theme. Visit the Edit Theme Details tab to see advanced options.',
									'fsestudio'
							  )
							: __(
									'To get started, enter a theme name and click Save Your Theme. Once your theme is created, you can move on to building and customizing your theme.',
									'fsestudio'
							  ) }
					</p>
				</div>
			</div>

			<div className="bg-fses-gray">
				<div className="mx-auto max-w-7xl">
					<ul className="flex m-0 gap-2">
						<li className="m-0">
							<button
								type="button"
								className="bg-white font-medium py-3 px-5 rounded-t"
								// onClick={ () => {
								// 	currentView.set(
								// 		'theme_templates'
								// 	);
								// } }
							>
								{ __( 'Theme Overview', 'fse-studio' ) }
							</button>
						</li>
						<li className="m-0">
							<button
								type="button"
								className="hover:bg-white font-medium py-3 px-5 rounded-t"
								// onClick={ () => {
								// 	currentView.set(
								// 		'theme_templates'
								// 	);
								// } }
							>
								{ __( 'Edit Theme Details', 'fse-studio' ) }
							</button>
						</li>
					</ul>
				</div>
			</div>

			<div className="mx-auto p-8 lg:p-12">
				<div className="mb-48 mt-12 max-w-7xl mx-auto">
					<div className="grid grid-cols-1 gap-y-10 gap-x-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
						<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
							<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue pb-0">
								<img
									alt="Theme Templates"
									className="w-full"
									src={ imgThemeTemplate }
								/>
							</div>
							<div className="flex justify-between p-10 text-center">
								<div className="flex flex-col gap-5">
									<h3 className="text-2xl font-semibold">
										{ __(
											'Theme Templates',
											'fse-studio'
										) }
									</h3>
									<p className="text-base">
										{ __(
											'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
											'fse-studio'
										) }
									</p>
									<button
										type="button"
										className="text-wp-blue hover:underline font-medium"
										onClick={ () => {
											currentView.set(
												'theme_templates'
											);
										} }
									>
										{ __(
											'Edit Theme Templates →',
											'fse-studio'
										) }
									</button>
								</div>
							</div>
							<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
								Your theme has no templates
							</div>
						</div>

						<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
							<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue pb-0">
								<img
									alt="Theme Template Parts"
									className="w-full"
									src={ imgThemeTemplateParts }
								/>
							</div>
							<div className="flex justify-between p-10 text-center">
								<div className="flex flex-col gap-5">
									<h3 className="text-2xl font-semibold">
										{ __( 'Template Parts', 'fse-studio' ) }
									</h3>
									<p className="text-base">
										{ __(
											'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
											'fse-studio'
										) }
									</p>
									<button
										type="button"
										className="text-wp-blue hover:underline font-medium"
										onClick={ () => {
											currentView.set( 'template_parts' );
										} }
									>
										{ __(
											'Edit Template Parts →',
											'fse-studio'
										) }
									</button>
								</div>
							</div>
							<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
								Your theme has no template parts
							</div>
						</div>

						<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
							<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue">
								<img
									alt="Theme Patterns"
									className="w-full"
									src={ imgThemePatterns }
								/>
							</div>
							<div className="flex justify-between p-10 text-center">
								<div className="flex flex-col gap-5">
									<h3 className="text-2xl font-semibold">
										{ __( 'Theme Patterns', 'fse-studio' ) }
									</h3>
									<p className="text-base">
										{ __(
											'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
											'fse-studio'
										) }
									</p>
									<button
										type="button"
										className="text-wp-blue hover:underline font-medium"
										onClick={ () => {
											currentView.set( 'theme_patterns' );
										} }
									>
										{ __(
											'Edit Theme Patterns →',
											'fse-studio'
										) }
									</button>
								</div>
							</div>
							<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
								Your theme has no patterns
							</div>
						</div>

						<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
							<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue pb-0">
								<img
									alt="Theme.json"
									className="w-full"
									src={ imgThemeJson }
								/>
							</div>
							<div className="flex justify-between p-10 text-center">
								<div className="flex flex-col gap-5">
									<h3 className="text-2xl font-semibold">
										{ __( 'Theme.json', 'fse-studio' ) }
									</h3>
									<p className="text-base">
										{ __(
											'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
											'fse-studio'
										) }
									</p>
									<button
										type="button"
										className="text-wp-blue hover:underline font-medium"
										onClick={ () => {
											currentView.set(
												'themejson_editor'
											);
										} }
									>
										{ __(
											'Edit Theme.json →',
											'fse-studio'
										) }
									</button>
								</div>
							</div>
							<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
								Your theme.json file is unedited
							</div>
						</div>

						<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
							<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue">
								<img
									alt="Theme Style Variations"
									className="w-full max-w-[260px] mx-auto"
									src={ imgThemeStyleVariations }
								/>
							</div>
							<div className="flex justify-between p-10 text-center">
								<div className="flex flex-col gap-5">
									<h3 className="text-2xl font-semibold">
										{ __(
											'Style Variations',
											'fse-studio'
										) }
									</h3>
									<p className="text-base">
										{ __(
											'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
											'fse-studio'
										) }
									</p>
									<button
										type="button"
										className="text-wp-blue hover:underline font-medium"
										onClick={ () => {
											currentView.set(
												'themejson_editor'
											);
										} }
									>
										{ __(
											'Edit Style Variations →',
											'fse-studio'
										) }
									</button>
								</div>
							</div>
							<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
								Your theme has no style variations
							</div>
						</div>

						<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
							<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue">
								<img
									alt="Export Theme"
									className="w-full max-w-[260px] mx-auto"
									src={ imgThemeExport }
								/>
							</div>
							<div className="flex justify-between p-10 text-center">
								<div className="flex flex-col gap-5">
									<h3 className="text-2xl font-semibold">
										{ __(
											'Download Theme Zip',
											'fse-studio'
										) }
									</h3>
									<p className="text-base">
										{ __(
											'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
											'fse-studio'
										) }
									</p>
									<button
										type="button"
										className="text-wp-blue hover:underline font-medium"
										onClick={ () => {
											currentTheme.export();
										} }
									>
										{ __( 'Download Theme', 'fse-studio' ) }
									</button>
								</div>
							</div>
							<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
								You can also view your theme files
							</div>
						</div>
					</div>
				</div>

				<form className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10 lg:gap-20">
					<div className="flex-initial w-full md:w-2/3">
						{ currentTheme.existsOnDisk ? (
							<div className="text-base flex flex-row items-center mb-12 border border-[#008B24] rounded-md border-l-8 bg-[#EEF5EE]">
								<span className="text-[#008B24] px-8 text-xl fill-current">
									<svg
										width="22"
										height="22"
										viewBox="0 0 22 22"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M15.2071 8.29289C15.5976 8.68342 15.5976 9.31658 15.2071 9.70711L10.7071 14.2071C10.3166 14.5976 9.68342 14.5976 9.29289 14.2071L6.79289 11.7071C6.40237 11.3166 6.40237 10.6834 6.79289 10.2929C7.18342 9.90237 7.81658 9.90237 8.20711 10.2929L10 12.0858L13.7929 8.29289C14.1834 7.90237 14.8166 7.90237 15.2071 8.29289Z"
											fill="#35872F"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2ZM0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11Z"
											fill="#35872F"
										/>
									</svg>
								</span>
								<span
									className="p-6 bg-white rounded-r-md"
									role="dialog"
									aria-label="Theme Saved"
								>
									<p className="font-bold text-base mb-2">
										{ __(
											'Theme successfully created!',
											'fse-studio'
										) }
									</p>
									<p className="text-base">
										{ __(
											'Your theme has been created, saved to your theme directory, and activated on this site! Continue customizing your theme by heading to Themes and Styles.',
											'fse-studio'
										) }
									</p>
									<button
										type="button"
										className="font-bold mt-2 inline-block hover:cursor-pointer hover:text-wp-black underline text-[#008B24]"
										onClick={ () => {
											currentView.set(
												'themejson_editor'
											);
										} }
									>
										{ __(
											'Go to Styles and Settings →',
											'fse-studio'
										) }
									</button>
								</span>
							</div>
						) : null }
						<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center pt-0">
							<label
								htmlFor="theme-name"
								className="block font-medium text-gray-700 sm:col-span-1"
							>
								{ __( 'Theme Name', 'fse-studio' ) }
							</label>
							<div className="mt-1 sm:mt-0 sm:col-span-2">
								<input
									ref={ themeNameInput }
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
								<h3 className="cursor-pointer group-focus-visible:text-wp-blue inline">
									Additional Theme Details
								</h3>
							</summary>

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
										value={
											currentTheme?.data?.dirname ?? ''
										}
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
										value={
											currentTheme?.data?.namespace ?? ''
										}
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
											currentTheme?.data?.uri
												? currentTheme.data.uri
												: ''
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
										value={
											currentTheme?.data?.author_uri ?? ''
										}
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
									{ __(
										'Tags (comma separated)',
										'fse-studio'
									) }
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
									{ __(
										'Tested up to (WP Version)',
										'fse-studio'
									) }
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
												tested_up_to:
													event.target.value,
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
									{ __(
										'Minimum PHP Version',
										'fse-studio'
									) }
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
												requires_php:
													event.target.value,
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
										value={
											currentTheme?.data?.text_domain ??
											''
										}
										disabled
									/>
								</div>
							</div>
						</details>
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
											{ __(
												'Settings Saved!',
												'fse-studio'
											) }
										</span>
									) : null }
									<button
										type="button"
										className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
										onClick={ () => {
											currentTheme.save();
										} }
									>
										{ __(
											'Save Your Theme',
											'fse-studio'
										) }
									</button>
									{ ! currentTheme?.existsOnDisk &&
									Object.keys( themes.themes ).length > 1 ? (
										<button
											type="button"
											className="inline-flex items-center ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
											onClick={ () => {
												const modifiedThemes = {
													...themes.themes,
												};
												delete modifiedThemes[
													currentThemeId.value
												];
												themes.setThemes( {
													...modifiedThemes,
												} );

												currentThemeId.set(
													Object.keys(
														themes.themes
													)[ 0 ]
												);
											} }
										>
											{ __( 'Cancel', 'fse-studio' ) }
										</button>
									) : null }
								</div>
							</div>
						</div>
					</div>
					<div className="flex-1 w-full md:w-1/3 text-base">
						{ ! currentTheme.existsOnDisk ? (
							<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded mb-5">
								<div>
									<div className="flex flex-col gap-5">
										<div>
											<h2 className="mb-2 font-medium">
												Need some help with this tool?
											</h2>
											<p className="mb-2 font-medium">
												Watch our demo video
											</p>
											<div className="w-full">
												<iframe
													width="100%"
													height="150px"
													src="https://www.youtube.com/embed/LmvPkQkjq9I"
													title="YouTube video player"
													frameBorder="0"
													allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
													allowFullScreen
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						) : null }
						{ currentTheme.existsOnDisk ? (
							<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded mb-5">
								<div>
									<div className="flex flex-col gap-5">
										<div>
											<h2 className="mb-2 font-medium">
												Theme Actions
											</h2>
											<p className="text-base">
												Use the selector below to load a
												theme to work on, or create a
												new theme with the Create
												button.
											</p>
										</div>
										{
											// In order to render the selector…
											// There should be at least 1 theme other than the currently selected theme.
											// Or the current theme should have been saved to disk.
											Object.keys( themes.themes ).some(
												( themeName ) =>
													themeName !==
														currentThemeId.value ||
													currentTheme.existsOnDisk
											) ? (
												<>
													<div className="flex flex-col gap-2">
														<div>
															<label
																htmlFor="themes"
																className="block text-sm font-medium text-gray-700 visuallyhidden"
															>
																{ __(
																	'Choose a theme',
																	'fse-studio'
																) }
															</label>
															{ renderThemeSelector() }
														</div>
													</div>
												</>
											) : null
										}
										{ currentTheme?.existsOnDisk ? (
											<button
												type="button"
												className="w-full items-center px-4 py-2 border-4 border-transparent font-medium text-center rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
												onClick={ () => {
													createNewTheme(
														themes,
														currentThemeId
													);
												} }
											>
												{ __(
													'Create A New Theme',
													'fse-studio'
												) }
											</button>
										) : null }
									</div>
								</div>
							</div>
						) : null }

						{ currentTheme?.existsOnDisk ? (
							<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded mb-5">
								<div>
									<h2 className="mb-2 font-medium">
										Export theme to .zip
									</h2>
									<p className="text-base mb-5">
										{ __(
											"Click the button below to export your theme to a zip file. We'll include your patterns, templates, styles, and theme.json file.",
											'fsestudio'
										) }
									</p>
									<button
										type="button"
										className="w-full items-center px-4 py-2 border-4 border-transparent font-medium text-center rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
										onClick={ () => {
											currentTheme.export();
										} }
									>
										{ __( 'Export Theme', 'fse-studio' ) }
									</button>
								</div>
							</div>
						) : null }
					</div>
				</form>
			</div>
		</div>
	);
}
