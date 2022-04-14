// @ts-check

/**
 * Fse Studio
 */

// WP Dependencies.
import {
	createInterpolateElement,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	Icon,
	layout,
	file,
	globe,
	check,
	download,
	close,
} from '@wordpress/icons';

import useStudioContext from '../../hooks/useStudioContext';

// Components
import PatternPreview from '../PatternPreview';
import PatternPicker from '../PatternPicker';
import ThemeTemplatePicker from '../ThemeTemplatePicker';

// Utils
import classNames from '../../utils/classNames';

/** @param {{visible: boolean}} props */
export default function ThemeManager( { visible } ) {
	const {
		themes,
		currentThemeId,
		currentTheme,
		currentThemeJsonFileId,
	} = useStudioContext();

	useEffect( () => {
		if ( currentTheme.data?.theme_json_file ) {
			currentThemeJsonFileId.set( currentTheme.data?.theme_json_file );
		} else {
			currentThemeJsonFileId.set( '' );
		}
	}, [ currentTheme ] );

	function renderThemeSelector() {
		const renderedThemes = [];

		renderedThemes.push(
			<option key={ 1 }>{ __( 'Choose a theme', 'fse-studio' ) }</option>
		);

		let counter = 3;

		for ( const thisTheme in themes.themes ) {
			const themeInQuestion = themes.themes[ thisTheme ];
			renderedThemes.push(
				<option key={ counter } value={ themeInQuestion.dirname }>
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
					className="mt-1 block w-60 h-10 pl-3 pr-10 py-2 text-base !border-gray-300 !focus:outline-none !focus:ring-wp-blue !focus:border-wp-blue !sm:text-sm !rounded-md"
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

	function renderThemeEditorWhenReady() {
		if ( ! currentTheme.data ) {
			return null;
		}

		return <ThemeDataEditor />;
	}

	return (
		<>
			<div hidden={ ! visible } className="fsestudio-theme-manager p-12">
				<div className="max-w-7xl mx-auto bg-white shadow">
					<h1 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">
						{ __( 'Theme Manager', 'fse-studio' ) }
					</h1>
					<div className="px-4 sm:px-6 md:px-8 bg-[#F8F8F8] py-8 flex sm:flex-row flex-col items-end">
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
									<div>
										<label
											htmlFor="themes"
											className="block text-sm font-medium text-gray-700"
										>
											{ __(
												'Choose a theme',
												'fse-studio'
											) }
										</label>
										{ renderThemeSelector() }
									</div>
									<div className="flex flex-col mx-6 my-2.5">
										{ __( 'or', 'fse-studio' ) }
									</div>
								</>
							) : null
						}
						<div className="flex flex-col">
							<button
								type="button"
								className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
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
										theme_json_file: 'default',
										included_patterns: [],
										template_files: {
											index: 'homepage',
											404: null,
											archive: null,
											single: null,
											page: null,
											search: null,
										},
									};

									themes.setThemes( {
										...themes.themes,
										'my-new-theme': newThemeData,
									} );

									// Switch to the newly created theme.
									currentThemeId.set( 'my-new-theme' );
								} }
							>
								{ __( 'Create a new theme', 'fse-studio' ) }
							</button>
						</div>
					</div>
					{ renderThemeEditorWhenReady() }
				</div>
			</div>
		</>
	);
}

function ThemeDataEditor() {
	const { currentTheme } = useStudioContext();

	const [ themeEditorCurrentTab, setThemeEditorCurrentTab ] = useState(
		'theme_setup'
	);

	const views = [
		{
			name: __( 'Theme Setup', 'fse-studio' ),
			slug: 'theme_setup',
			icon: file,
			available: true,
		},
		{
			name: __( 'Add Patterns', 'fse-studio' ),
			slug: 'add_patterns',
			icon: layout,
			available: currentTheme.existsOnDisk,
		},
		{
			name: __( 'Customize Styles', 'fse-studio' ),
			slug: 'customize_styles',
			icon: globe,
			available: false, // @todo: change back to currentTheme.existsOnDisk or delete this object.
		},
		{
			name: __( 'Theme Template Files', 'fse-studio' ),
			slug: 'theme_template_files',
			icon: globe,
			available: currentTheme.existsOnDisk,
		},
	];

	return (
		<>
			<div className="flex flex-row px-4 sm:px-6 md:px-8 py-8 gap-14">
				<ul className="w-[180px] min-w-[180px]">
					{ views.map( ( item ) => {
						return (
							<li key={ item.name }>
								<button
									hidden={ ! item.available }
									className={ classNames(
										'w-full text-left p-5 font-medium' +
											( themeEditorCurrentTab ===
											item.slug
												? ' bg-gray-100'
												: ' hover:bg-gray-100' ),
										! item.available
											? 'opacity-30 bg-white-100'
											: ''
									) }
									key={ item.name }
									onClick={ () => {
										setThemeEditorCurrentTab( item.slug );
									} }
								>
									{ item.name }
								</button>
							</li>
						);
					} ) }
				</ul>
				<ThemeSetup
					isVisible={ themeEditorCurrentTab === 'theme_setup' }
				/>
				<ThemePatterns
					isVisible={ themeEditorCurrentTab === 'add_patterns' }
				/>
				<ThemeCustomizeStyles />
				<ThemeTemplateFiles
					isVisible={
						themeEditorCurrentTab === 'theme_template_files'
					}
				/>
			</div>
			<div className="p-5 text-xl border-t border-gray-200 px-4 sm:px-6 md:px-8 flex justify-between items-center sticky bottom-0 bg-[rgba(255,255,255,.8)] backdrop-blur-sm">
				<div>
					<button
						type="button"
						className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
						style={ {
							display: ! currentTheme.existsOnDisk ? 'none' : '',
						} }
						onClick={ () => {
							currentTheme.export().then( ( response ) => {
								window.open( response );
							} );
						} }
					>
						<Icon
							className="fill-current mr-2"
							icon={ download }
							size={ 24 }
						/>
						{ __( 'Export theme to zip', 'fse-studio' ) }
					</button>
				</div>

				<div className="flex items-center">
					{ currentTheme.hasSaved ? (
						<div className="text-sm text-green-700 flex flex-row items-center mr-6">
							<Icon
								className="fill-current"
								icon={ check }
								size={ 26 }
							/>{ ' ' }
							<span role="dialog" aria-label="Theme Saved">
								{ __(
									'Theme saved to your /themes/ folder',
									'fse-studio'
								) }
							</span>
						</div>
					) : null }
					<button
						type="button"
						className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
						onClick={ () => {
							currentTheme.save();
						} }
					>
						{ __( 'Save Theme Settings', 'fse-studio' ) }
					</button>
				</div>
			</div>
		</>
	);
}

/** @param {{isVisible: boolean}} props */
function ThemeSetup( { isVisible } ) {
	const { currentTheme } = useStudioContext();
	const themeNameInput = useRef( null );

	return (
		<div hidden={ ! isVisible } className="flex-1">
			<form className="divide-y divide-gray-200">
				<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center pt-0">
					<label
						htmlFor="theme-name"
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
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
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Directory Name', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Namespace', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Theme URI', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Author', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Author URI', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Description', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Tags (comma separated)', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Tested up to (WP Version)', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Minimum WP Version', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Minimum PHP Version', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Version', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Text Domain', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
							type="text"
							id="text-domain"
							value={ currentTheme?.data?.text_domain ?? '' }
							disabled
						/>
					</div>
				</div>
			</form>
		</div>
	);
}

/** @param {{isVisible: boolean}} props */
function ThemePatterns( { isVisible } ) {
	const {
		patterns,
		currentTheme,
		currentThemeJsonFile,
		currentView,
	} = useStudioContext();

	const [ isModalOpen, setModalOpen ] = useState( false );

	return (
		<div hidden={ ! isVisible } className="w-full">
			<div className="w-full flex flex-col">
				<div className="w-full text-center bg-gray-100 p-7 self-start">
					<h2 className="block text-lg font-medium text-gray-700 sm:col-span-1">
						{ __( 'Add patterns to your theme', 'fse-studio' ) }
					</h2>
					<p className="mt-2">
						{ createInterpolateElement(
							__(
								'<span>You can also create patterns in the</span> <button>Pattern Editor</button>',
								'fse-studio'
							),
							{
								span: <span />,
								button: (
									<button
										className="mt-2 text-blue-400"
										onClick={ () => {
											currentView.set( 'pattern_editor' );
										} }
									/>
								),
							}
						) }
					</p>
					<p className="mt-5">
						<button
							className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => setModalOpen( true ) }
						>
							{ __( 'Browse Patterns', 'fse-studio' ) }
						</button>
					</p>
				</div>
				{ currentTheme?.data?.included_patterns?.length ? (
					<>
						<h3 className="my-6 block text-base font-medium text-gray-700 sm:col-span-1">
							{ __(
								'Patterns included in this theme:',
								'fse-studio'
							) }
						</h3>
						<div className="grid w-full grid-cols-3 gap-5">
							{ currentTheme.data.included_patterns.map(
								( patternName, index ) => {
									return (
										<div
											key={ index }
											className="min-h-[300px] bg-gray-100 flex flex-col justify-between border border-gray-200 rounded relative group"
										>
											<button
												type="button"
												className="absolute top-2 right-2"
												// onClick={ }
											>
												<Icon
													className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300 opacity-0 group-hover:opacity-100"
													icon={ close }
													size={ 30 }
												/>
											</button>

											<div className="p-3 flex flex-grow items-center">
												<PatternPreview
													key={
														patterns.patterns[
															patternName
														].name
													}
													blockPatternData={
														patterns.patterns[
															patternName
														]
													}
													themeJsonData={
														currentThemeJsonFile.data
													}
													scale={ 0.2 }
												/>
											</div>
											<div>
												<h3 className="text-sm bg-white p-4 rounded-b">
													{
														patterns.patterns[
															patternName
														]?.title
													}
												</h3>
											</div>
										</div>
									);
								}
							) }
						</div>
					</>
				) : null }
			</div>
			{ isModalOpen ? (
				<Modal
					title={ __(
						'Pick the patterns to include in this theme',
						'fse-studio'
					) }
					onRequestClose={ () => {
						setModalOpen( false );
					} }
				>
					<PatternPicker
						patterns={ patterns.patterns }
						themeJsonData={ currentThemeJsonFile.data }
						selectedPatterns={ currentTheme.data.included_patterns }
						onClickPattern={ ( clickedPatternName ) => {
							if (
								currentTheme.data.included_patterns.includes(
									clickedPatternName
								)
							) {
								currentTheme.set( {
									...currentTheme.data,
									included_patterns: currentTheme.data.included_patterns.filter(
										( pattern ) =>
											pattern !== clickedPatternName
									),
								} );
							} else {
								currentTheme.set( {
									...currentTheme.data,
									included_patterns: [
										...currentTheme.data.included_patterns,
										clickedPatternName,
									],
								} );
							}
						} }
					/>
				</Modal>
			) : null }
		</div>
	);
}

/** @param {{isVisible: boolean}} props */
function ThemeTemplateFiles( { isVisible } ) {
	const { currentTheme } = useStudioContext();

	return (
		<div hidden={ ! isVisible } className="flex-1">
			<div className="divide-y divide-gray-200">
				{ Object.keys( currentTheme.data?.template_files ?? {} ).map(
					( templateName ) => {
						return (
							<ThemeTemplatePicker
								key={ templateName }
								templateName={ templateName }
							/>
						);
					}
				) }
			</div>
		</div>
	);
}

function ThemeCustomizeStyles() {
	return null;
}
