/**
 * Fse Studio
 */

/* global fsestudio, localStorage */

const { __ } = wp.i18n;
const { useSelect } = wp.data

import './../../css/src/index.scss';
import './../../css/src/tailwind.css';

import { useContext, useEffect, useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import ReactDOM from 'react-dom';
import {
	Icon,
	wordpress,
	layout,
	file,
	globe,
	close,
	chevronLeft,
	check,
	download,
} from '@wordpress/icons';

import { PatternPreview } from './components/PatternPreview/PatternPreview.js';
import PatternPicker from './components/PatternPicker/PatternPicker.js';

import {
	FseStudioContext,
	useThemes,
	useCurrentId,
	useThemeData,
	usePatterns,
	useThemeJsonFiles,
	useThemeJsonFile,
	useCurrentView,
} from './non-visual/non-visual-logic.js';

import { PatternEditorApp } from './visual/PatternEditor.js';
import { ThemeJsonEditorApp } from './visual/ThemeJsonEditor.js';

function classNames( ...classes ) {
	return classes.filter( Boolean ).join( ' ' );
}

ReactDOM.render( <FseStudioApp />, document.getElementById( 'fsestudioapp' ) );

export function FseStudioApp() {
	const currentThemeJsonFileId = useCurrentId();
	const currentThemeJsonFile = useThemeJsonFile(
		currentThemeJsonFileId.value
	);
	const themes = useThemes( {
		themes: fsestudio.themes,
		currentThemeJsonFile,
	} );
	const currentThemeId = useCurrentId( fsestudio.initialTheme );
	const themeJsonFiles = useThemeJsonFiles( fsestudio.themeJsonFiles );

	return (
		<FseStudioContext.Provider
			value={ {
				currentView: useCurrentView( { currentView: 'theme_manager' } ),
				patterns: usePatterns( fsestudio.patterns ),
				themes,
				currentThemeId,
				currentTheme: useThemeData(
					currentThemeId.value,
					themes,
					currentThemeJsonFile
				),
				themeJsonFiles,
				currentThemeJsonFileId,
				currentThemeJsonFile,
				siteUrl: fsestudio.siteUrl,
				apiEndpoints: fsestudio.api_endpoints,
				blockEditorSettings: fsestudio.blockEditorSettings,
			} }
		>
			<FseStudio />
		</FseStudioContext.Provider>
	);
}

function FseStudio() {
	const { currentView, currentTheme } = useContext( FseStudioContext );
	const [ sidebarOpen, setSidebarOpen ] = useState(
		! JSON.parse( localStorage.getItem( 'fseStudioSidebarClosed' ) )
	);

	const navigation = [
		{
			name: 'Theme Manager',
			slug: 'theme_manager',
			icon: file,
			available: true,
		},
		{
			name: 'Pattern Manager',
			slug: 'pattern_manager',
			icon: layout,
			available: currentTheme.existsOnDisk,
		},
		{
			name: 'Theme.json Manager',
			slug: 'themejson_manager',
			icon: globe,
			available: currentTheme.existsOnDisk,
		},
	];

	useEffect( () => {
		localStorage.setItem( 'fseStudioSidebarClosed', ! sidebarOpen );
	}, [ sidebarOpen ] );

	function renderCurrentView() {
		return (
			<>
				<ThemeManager
					visible={ 'theme_manager' === currentView.currentView }
				/>
				<PatternEditorApp
					visible={ 'pattern_manager' === currentView.currentView }
				/>
				<ThemeJsonEditorApp
					visible={ 'themejson_manager' === currentView.currentView }
				/>
			</>
		);
	}

	return (
		<>
			<div
				className={ `${
					sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
				}` }
			>
				{ /* Static sidebar for desktop */ }
				<div
					className={ `hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 ${
						sidebarOpen ? 'sidebar-open' : '!hidden'
					}` }
				>
					<div className="flex-1 flex flex-col min-h-0 bg-wp-black">
						<div className="flex items-center h-16 flex-shrink-0 px-3">
							<button
								className="text-white font-semibold"
								onClick={ () => setSidebarOpen( true ) }
							>
								<Icon
									className="text-white fill-current"
									icon={ wordpress }
									size={ 36 }
								/>
							</button>
							<span className="text-white font-semibold ml-4 grow">
								{ __( 'FSE Studio', 'fse-studio' ) }
							</span>
							<button
								className="text-white font-semibold ml-4"
								onClick={ () => setSidebarOpen( false ) }
							>
								<Icon
									className="text-white fill-current"
									icon={ close }
									size={ 30 }
								/>
							</button>
						</div>
						<div className="flex items-center text-white opacity-70 group hover:opacity-100 my-8 px-6">
							<Icon
								className="fill-current"
								icon={ chevronLeft }
								size={ 24 }
							/>
							<span>{ __( 'Dashboard', 'fse-studio' ) }</span>
						</div>
						<div className="flex-1 flex flex-col overflow-y-auto">
							<h3 className="text-white font-semibold text-xl px-8">
								{ __( 'FSE Studio', 'fse-studio' ) }
							</h3>
							<nav className="flex-1 px-4 py-4 space-y-1">
								{ navigation.map( ( item ) => {
									return (
										<button
											disabled={ ! item.available }
											key={ item.name }
											onClick={ () => {
												currentView.set( item.slug );
											} }
											className={ classNames(
												item.slug ===
													currentView.currentView
													? 'bg-wp-blue text-white hover:text-white'
													: 'text-white opacity-70 hover:text-white hover:opacity-100',
												'group flex items-center px-4 py-2 text-sm font-medium rounded-sm w-full',
												! item.available
													? 'opacity-30 hover:opacity-30'
													: ''
											) }
										>
											<Icon
												className={ classNames(
													item.current
														? 'text-white'
														: 'text-white opacity-70 group-hover:opacity-100 group-hover:text-white',
													'mr-3 flex-shrink-0 h-6 w-6 fill-current',
													! item.available
														? 'opacity-30 hover:opacity-30'
														: ''
												) }
												icon={ item.icon }
												size={ 24 }
											/>
											{ item.name }
										</button>
									);
								} ) }
							</nav>
						</div>
					</div>
				</div>

				<button
					className={ `bg-wp-black px-3 py-3.5 absolute ${
						sidebarOpen ? 'hidden' : ''
					}` }
					onClick={ () => setSidebarOpen( true ) }
				>
					<Icon
						className="text-white fill-current"
						icon={ wordpress }
						size={ 36 }
					/>
				</button>

				<div
					className={ `md:pl-80 flex flex-col ${
						sidebarOpen ? 'md:pl-80' : 'md:pl-0'
					}` }
				>
					<main className="flex-1">{ renderCurrentView() }</main>
				</div>
			</div>
		</>
	);
}

function ThemeManager( { visible } ) {
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

		return <ThemeDataEditor theme={ currentTheme } />;
	}

  const site = useSelect(select => {
    return select('core').getSite()
  }, [])

  if (!site) {
    return null
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
										uri: site.url.replace(/https?:\/\//g, ''),
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
										'index.html': '',
										'404.html': '',
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

function ThemeDataEditor( { theme } ) {
	const {
		patterns,
		currentTheme,
		currentThemeJsonFile,
		currentView,
	} = useContext( FseStudioContext );
	const [ themeEditorCurrentTab, setThemeEditorCurrentTab ] = useState(
		'theme_setup'
	);
	const [ isModalOpen, setModalOpen ] = useState( false );

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
	];

	/* eslint-disable */
	function formatPatternValuesForSelect() {
		const options = [];
		for ( const patternNum in theme.data.included_patterns ) {
			const patternId = theme.data.included_patterns[ patternNum ];
			options.push( {
				value: patterns.patterns[ patternId ].name,
				label: patterns.patterns[ patternId ].title,
			} );
		}

		return options;
	}

	function formatPatternOptionsForSelect() {
		const options = [];
		for ( const pattern in patterns.patterns ) {
			options.push( {
				value: patterns.patterns[ pattern ].name,
				label: patterns.patterns[ pattern ].title,
			} );
		}

		return options;
	}

	function formatPatternOptionsFromSelect( valuesFromSelect ) {
		//console.log( theme.data );
		//console.log( valuesFromSelect );

		const reAssembledThemePatterns = [];

		for ( const value in valuesFromSelect ) {
			//console.log( valuesFromSelect[value].value );
			//console.log( patterns.patterns[valuesFromSelect[value].value]);

			if ( patterns.patterns[ valuesFromSelect[ value ].value ] ) {
				const pattern =
					patterns.patterns[ valuesFromSelect[ value ].value ];

				reAssembledThemePatterns.push( pattern.name );
			}
		}
		console.log( reAssembledThemePatterns );

		return reAssembledThemePatterns;
	}
	/* eslint-enable */

	function maybeAddPatternsView() {
		if ( themeEditorCurrentTab !== 'add_patterns' ) {
			return null;
		}

		return (
			<>
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
					{ theme.data.included_patterns.length ? (
						<>
							<h3 className="mt-2 block text-sm font-medium text-gray-700 sm:col-span-1">
								{ __(
									'Patterns included in this theme:',
									'fse-studio'
								) }
							</h3>
							<div className="grid w-full grid-cols-3 gap-5 p-8">
								{ theme.data.included_patterns.map(
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
							selectedPatterns={ theme.data.included_patterns }
							onClickPattern={ ( clickedPatternName ) => {
								if (
									theme.data.included_patterns.includes(
										clickedPatternName
									)
								) {
									theme.set( {
										...theme.data,
										included_patterns: theme.data.included_patterns.filter(
											( pattern ) =>
												pattern !== clickedPatternName
										),
									} );
								} else {
									theme.set( {
										...theme.data,
										included_patterns: [
											...theme.data.included_patterns,
											clickedPatternName,
										],
									} );
								}
							} }
							selectMultiple={ true }
						/>
					</Modal>
				) : null }
			</>
		);
	}

	function maybeRenderCustomizeStylesView() {}

	function maybeRenderThemeSetupView() {
		return (
			<div
				hidden={ themeEditorCurrentTab !== 'theme_setup' }
				className="flex-1"
			>
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
								value={
									theme?.data?.name ? theme.data.name : ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.dirname
										? theme.data.dirname
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.namespace
										? theme.data.namespace
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
								value={ theme?.data?.uri ? theme.data.uri : '' }
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.author ? theme.data.author : ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.author_uri
										? theme.data.author_uri
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.description
										? theme.data.description
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.tags ? theme.data.tags : ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.tested_up_to
										? theme.data.tested_up_to
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.requires_wp
										? theme.data.requires_wp
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.requires_php
										? theme.data.requires_php
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.version
										? theme.data.version
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
									theme?.data?.text_domain
										? theme.data.text_domain
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
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
				{ maybeRenderThemeSetupView() }
				{ maybeAddPatternsView() }
				{ maybeRenderCustomizeStylesView() }
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
						if ( theme.hasSaved ) {
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
							theme.save();
						} }
					>
						{ __( 'Save Theme Settings', 'fse-studio' ) }
					</button>
				</div>
			</div>
		</>
	);
}
