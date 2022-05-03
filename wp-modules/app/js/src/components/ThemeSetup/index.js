import { v4 as uuidv4 } from 'uuid';

// WP Dependencies.
import {
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Icon,
	layout,
	file,
	globe,
	check,
	download,
	close,
	edit,
	plus,
} from '@wordpress/icons';

import useStudioContext from '../../hooks/useStudioContext';

/** @param {{isVisible: boolean}} props */
export default function ThemeSetup( { isVisible } ) {
	const { currentTheme, themes, currentThemeId } = useStudioContext();
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
		console.log( currentTheme );
		
		for ( const thisTheme in themes.themes ) {
			const themeInQuestion = themes.themes[ thisTheme ];
			renderedThemes.push(
				<option key={ counter } value={ thisTheme }>
					{ thisTheme === currentThemeId.value
						? currentTheme.data?.name
						: themeInQuestion?.name }
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
			<div className="bg-fses-gray mx-auto p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">{ __( 'Theme Setup', 'fse-studio' ) }</h1>
					<p className="text-lg max-w-2xl">This is where you'll set up the technical details of your theme that appear in readme.txt, which are helpful for end users to understand the theme's capabilities.</p>
				</div>
			</div>

			<div className="mx-auto p-12">
				<form className="max-w-7xl mx-auto flex justify-between gap-20">
					<div className="w-[65%]">
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
								{ currentTheme.themeNameIsDefault ? (
									<div className="text-sm text-red-700 flex flex-row items-center mr-6">
										<Icon
											className="fill-current"
											icon={ check }
											size={ 26 }
										/>{ ' ' }
										<span role="dialog" aria-label="Theme Saved">
											{ __(
												'Theme name needs to be different than My New Theme',
												'fse-studio'
											) }
										</span>
									</div>
								) : null }
							</div>
						</div>

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
					</div>

					<div className="flex-1 text-base">
						<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded mb-5">
							<div>
								<div className="flex flex-col gap-5">
									<div>
										<h4 className="mb-2 font-medium">Theme Actions</h4>
										<p className="text-base">Use the selector below to load a theme to work on, or create a new theme with the Create button.</p>
									</div>
									{
										// In order to render the selector…
										// There should be at least 1 theme other than the currently selected theme.
										// Or the current theme should have been saved to disk.
										Object.keys( themes.themes ).some(
											( themeName ) =>
												themeName !== currentThemeId.value ||
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
									<button
										type="button"
										className=" w-full items-center px-4 py-2 border-4 border-transparent font-medium text-center rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
										onClick={ () => {
											/** @type {import('../../hooks/useThemeData').Theme} */
											const newThemeData = {
												name: 'My New Theme',
												dirname: 'my-new-theme',
												namespace: 'MyNewTheme',
												uri: 'mysite.com',
												author: 'Me',
												author_uri: 'mysite.com',
												description: 'My new FSE Theme',
												tags: '',
												tested_up_to: '5.9',
												requires_wp: '5.9',
												requires_php: '7.3',
												version: '1.0.0',
												text_domain: 'my-new-theme',
											};

											const themeId = uuidv4();
											themes.setThemes( {
												...themes.themes,
												[themeId]: newThemeData,
											} );
		
											// Switch to the newly created theme.
											currentThemeId.set( themeId );
										} }
									>
										{ __( 'Create A New Theme', 'fse-studio' ) }
									</button>
								</div>
							</div>
						</div>

						<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded">
							<div>
								<h4 className="mb-2 font-medium">Setting up your theme</h4>
								<p className="text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
							</div>
							<div>
								<h4 className="mb-2 font-medium">Helpful Documentation</h4>
								<ul>
									<li><a className="text-wp-blue" href="#">Full Site Editing Documentation</a></li>
									<li><a className="text-wp-blue" href="#">About Full Site Editing Themes</a></li>
									<li><a className="text-wp-blue" href="#">Something Else</a></li>
								</ul>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}