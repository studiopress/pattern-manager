/**
 * Fse Studio
 */

const { __ } = wp.i18n;

// WP Dependencies.
import { useContext, useEffect, useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import { Icon, layout, file, globe, check, download } from '@wordpress/icons';

// Context
import { FseStudioContext } from './../../contexts/FseStudioContext';

// Components
import { PatternPreview } from './../PatternPreview/PatternPreview.js';
import PatternPicker from './../PatternPicker/PatternPicker.js';

// Utils
import { classNames } from './../../utils/classNames';

export function ThemeManager( { visible } ) {
	const {
		themes,
		currentThemeId,
		currentTheme,
		currentThemeJsonFileId,
	} = useContext( FseStudioContext );

	useEffect( () => {
		if ( currentTheme.data?.theme_json_file ) {
			currentThemeJsonFileId.set( currentTheme.data?.theme_json_file );
		} else {
			currentThemeJsonFileId.set( false );
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
					{ themeInQuestion.name }
				</option>
			);
			counter++;
		}

		return (
			<>
				<select
					className="mt-1 block w-60 h-10 pl-3 pr-10 py-2 text-base !border-gray-300 !focus:outline-none !focus:ring-wp-blue !focus:border-wp-blue !sm:text-sm !rounded-md"
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
			return '';
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
						{ Object.keys( themes.themes ).length > 0 ? (
							<>
								<div>
									<label
										htmlFor="location"
										className="block text-sm font-medium text-gray-700"
									>
										{ __( 'Choose a theme', 'fse-studio' ) }
									</label>
									{ renderThemeSelector() }
								</div>
								<div className="flex flex-col mx-6 my-2.5">
									{ __( 'or', 'fse-studio' ) }
								</div>
							</>
						) : null }
						<div className="flex flex-col">
							<button
								type="button"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
								onClick={ () => {
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
										requires_php: '7.4',
										version: '1.0.0',
										text_domain: 'my-new-theme',
										theme_json_file: 'default',
										included_patterns: [],
										template_files: {
											index: null,
											404: null,
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
	const { currentTheme } = useContext( FseStudioContext );

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
			available: currentTheme.existsOnDisk,
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
				<ul className="w-72">
					{ views.map( ( item ) => {
						return (
							<li key={ item.name }>
								<button
									disabled={ ! item.available }
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
				{ themeEditorCurrentTab === 'theme_setup' ? (
					<div className="w-72 bg-gray-100 p-5 self-start">
						<h3>{ __( 'Sidebar', 'fse-studio' ) }</h3>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Donec ac purus nec diam laoreet sollicitudin.
							Fusce ullamcorper imperdiet turpis, non accumsan
							enim egestas in.
						</p>
					</div>
				) : null }
			</div>
			<div className="p-5 text-xl border-t border-gray-200 px-4 sm:px-6 md:px-8 flex justify-between items-center">
				<button
					type="button"
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
				>
					<Icon
						className="fill-current mr-2"
						icon={ download }
						size={ 24 }
					/>
					{ __( 'Export theme to zip', 'fse-studio' ) }
				</button>

				<div className="flex items-center">
					{ ( () => {
						if ( currentTheme.hasSaved ) {
							return (
								<span className="text-sm text-green-600 flex flex-row items-center mr-6">
									<Icon
										className="fill-current"
										icon={ check }
										size={ 26 }
									/>{ ' ' }
									{ __(
										'Theme saved to your /themes/ folder',
										'fse-studio'
									) }
								</span>
							);
						}
					} )() }
					<button
						type="button"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
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

function ThemeSetup( { isVisible } ) {
	const { currentTheme } = useContext( FseStudioContext );

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
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
							type="text"
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

				<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
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
							value={
								currentTheme?.data?.dirname
									? currentTheme.data.dirname
									: ''
							}
							onChange={ ( event ) => {
								currentTheme.set( {
									...currentTheme.data,
									dirname: event.target.value,
								} );
							} }
						/>
					</div>
				</div>

				<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
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
							value={
								currentTheme?.data?.namespace
									? currentTheme.data.namespace
									: ''
							}
							onChange={ ( event ) => {
								currentTheme.set( {
									...currentTheme.data,
									namespace: event.target.value,
								} );
							} }
						/>
					</div>
				</div>

				<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
					<label
						htmlFor="uri"
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'URI', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
							type="text"
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
							value={
								currentTheme?.data?.author_uri
									? currentTheme.data.author_uri
									: ''
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
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						{ __( 'Description', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
							type="text"
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
						{ __( 'Tags (comma separated', 'fse-studio' ) }
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-2">
						<input
							className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
							type="text"
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

				<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
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
							value={
								currentTheme?.data?.text_domain
									? currentTheme.data.text_domain
									: ''
							}
							onChange={ ( event ) => {
								currentTheme.set( {
									...currentTheme.data,
									text_domain: event.target.value,
								} );
							} }
						/>
					</div>
				</div>
			</form>
		</div>
	);
}

function ThemePatterns( { isVisible } ) {
	const {
		patterns,
		currentTheme,
		currentThemeJsonFile,
		currentView,
	} = useContext( FseStudioContext );

	const [ isModalOpen, setModalOpen ] = useState( false );

	return (
		<div hidden={ ! isVisible } className="w-full">
			<div className="w-full flex flex-col">
				<div className="w-full text-center bg-gray-100 p-5 self-start">
					<h3 className="block text-sm font-medium text-gray-700 sm:col-span-1">
						{ __( 'Add patterns to your theme', 'fse-studio' ) }
					</h3>
					<p className="mt-2">
						<span>
							{ __(
								'You can also create patterns in the',
								'fse-studio'
							) }
						</span>
						&nbsp;
						<button
							className="mt-2 text-blue-400"
							onClick={ () => {
								currentView.set( 'pattern_manager' );
							} }
						>
							{ __( 'Pattern Manager', 'fse-studio' ) }
						</button>
					</p>
					<p className="mt-2">
						<button
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => setModalOpen( true ) }
						>
							{ __( 'Browse Patterns', 'fse-studio' ) }
						</button>
					</p>
				</div>
				{ currentTheme.data.included_patterns.length ? (
					<>
						<h3 className="mt-2 block text-sm font-medium text-gray-700 sm:col-span-1">
							{ __(
								'Patterns included in this theme:',
								'fse-studio'
							) }
						</h3>
						<div className="grid w-full grid-cols-3 gap-5 p-8">
							{ currentTheme.data.included_patterns.map(
								( patternName, index ) => {
									return (
										<div
											key={ index }
											className="min-h-[300px] bg-gray-200"
										>
											<h3 className="border-b border-gray-200 p-5 px-4 text-lg sm:px-6 md:px-8">
												{
													patterns.patterns[
														patternName
													]?.title
												}
											</h3>
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
						selectMultiple={ true }
					/>
				</Modal>
			) : null }
		</div>
	);
}

function ThemeTemplateFiles( { isVisible } ) {
	const { patterns, currentTheme, currentThemeJsonFile } = useContext(
		FseStudioContext
	);

	const [ isModalOpen, setModalOpen ] = useState( false );
	const [ focusedTemplateFileName, setFocusedTemplateFileName ] = useState(
		false
	);

	return (
		<div hidden={ ! isVisible } className="flex-1">
			<div className="divide-y divide-gray-200">
				<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center pt-0">
					<label htmlFor="theme-name">
						<span className="block text-sm font-medium text-gray-700 sm:col-span-1">
							{ __( 'Template: index.html', 'fse-studio' ) }
						</span>
						<span>
							{ __(
								'This template is used to show any post or page if no other template makes sense.',
								'fse-studio'
							) }
							other template makes sense.
						</span>
						<button
							className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => {
								setFocusedTemplateFileName( 'index' );
								setModalOpen( true );
							} }
						>
							Set Pattern
						</button>
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-1">
						<div className="min-h-[30px] bg-white border border-[#F0F0F0]">
							<PatternPreview
								key={ 'index' }
								blockPatternData={
									patterns?.patterns[
										currentTheme.data?.template_files?.index
									]
								}
								themeJsonData={ currentThemeJsonFile.data }
								scale={ 0.2 }
							/>
						</div>
					</div>
				</div>
				<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
					<label htmlFor="theme-name">
						<span className="block text-sm font-medium text-gray-700 sm:col-span-1">
							{ __( 'Template: 404.html', 'fse-studio' ) }
						</span>
						<span>
							This template is used when the URL does not match
							anything on the website.
						</span>
						<button
							className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => {
								setFocusedTemplateFileName( '404' );
								setModalOpen( true );
							} }
						>
							Set Pattern
						</button>
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-1">
						<div className="min-h-[30px] bg-white border border-[#F0F0F0]">
							<PatternPreview
								key={ 'index' }
								blockPatternData={
									patterns?.patterns[
										currentTheme.data?.template_files?.[
											'404'
										]
									]
								}
								themeJsonData={ currentThemeJsonFile.data }
								scale={ 0.2 }
							/>
						</div>
					</div>
				</div>
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
						onClickPattern={ ( clickedPatternName ) => {
							setModalOpen( false );
							currentTheme.set( {
								...currentTheme.data,
								template_files: {
									...currentTheme.data.template_files,
									[ focusedTemplateFileName ]: clickedPatternName,
								},
							} );
						} }
					/>
				</Modal>
			) : null }
		</div>
	);
}

function ThemeCustomizeStyles() {
	return null;
}
