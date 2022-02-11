/**
 * Fse Studio
 */

const { __ } = wp.i18n;

import './../../css/src/index.scss';
import './../../css/src/tailwind.css';

import { useContext, useEffect, Fragment, useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import ReactDOM from 'react-dom';
import { Menu, Transition } from '@headlessui/react'
import { 
	Icon,
	wordpress,
	layout,
	file,
	globe,
	menu,
	close,
	chevronLeft,
	check,
	download
} from '@wordpress/icons';
import { PatternPicker } from '@fse-studio/components';

import {
	FseStudioContext,
	useThemes,
	useThemeData,
	usePatterns,
	useThemeJsonFiles,
	useCurrentThemeJsonFileData,
	useCurrentView,
} from './non-visual/non-visual-logic.js';


import { PatternEditorApp } from './visual/PatternEditor.js';
import { ThemeJsonEditorApp } from './visual/ThemeJsonEditor.js';
import { LayoutPreview } from './visual/ThemeEditor.js';

const userNavigation = [
	{ name: 'Your Profile', href: '#' },
	{ name: 'Settings', href: '#' },
	{ name: 'Sign out', href: '#' },
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

ReactDOM.render(
	<FseStudioApp />,
	document.getElementById('fsestudioapp')
);


export function FseStudioApp() {
	
	return (
		<FseStudioContext.Provider
			value={ {
				currentView: useCurrentView( { currentView: 'theme_manager' } ),
				patterns: usePatterns( fsestudio.patterns ),
				themes: useThemes( { themes: fsestudio.themes } ),
				themeJsonFiles: useThemeJsonFiles( fsestudio.themeJsonFiles ),
				currentThemeJsonFileData: useCurrentThemeJsonFileData(null),
				siteUrl: fsestudio.siteUrl,
				apiEndpiints: fsestudio.api_endpoints,
				blockEditorSettings:  fsestudio.blockEditorSettings
			} }
		>
			<FseStudio />
		</FseStudioContext.Provider>
	);
}

function FseStudio() {
	const { currentView } = useContext( FseStudioContext );
	const [sidebarOpen, setSidebarOpen] = useState(!JSON.parse(localStorage.getItem('fseStudioSidebarClosed')));

	const navigation = [
		{ name: 'Theme Manager', slug: 'theme_manager', icon: file, current: true },
		{ name: 'Pattern Manager', slug: 'pattern_manager', icon: layout, current: false },
		{ name: 'Theme.json Manager', slug: 'themejson_manager', icon: globe, current: false },
	]
	
	useEffect( () => {
		localStorage.setItem('fseStudioSidebarClosed', !sidebarOpen );
	}, [sidebarOpen] );

	function renderCurrentView() {
		return <>
			
			<ThemeManager visible={'theme_manager' === currentView.currentView} />
			<PatternEditorApp visible={'pattern_manager' === currentView.currentView} />
			<ThemeJsonEditorApp visible={'themejson_manager' === currentView.currentView} />
		</>
	}

	return (
		<>
			<div>
				{/* Static sidebar for desktop */}
				<div
					className={`hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 ${sidebarOpen ? "sidebar-open" : "!hidden"}`}
				>
					<div className="flex-1 flex flex-col min-h-0 bg-wp-black">
						<div className="flex items-center h-16 flex-shrink-0 px-3">
							<button 
								className='text-white font-semibold'
								onClick={() => setSidebarOpen(true)}
							>
								<Icon className='text-white fill-current' icon={ wordpress } size={ 36 }/>
							</button>
							<span className='text-white font-semibold ml-4 grow'>{ __( 'FSE Studio', 'fse-studio' ) }</span>
							<button 
								className='text-white font-semibold ml-4'
								onClick={() => setSidebarOpen(false)}
							>
								<Icon className='text-white fill-current' icon={ close } size={ 30 }/>
							</button>
						</div>
						<div className="flex items-center text-white opacity-70 group hover:opacity-100 my-8 px-6">
							<Icon className='fill-current' icon={ chevronLeft } size={ 24 }/>
							<span>{ __( 'Dashboard', 'fse-studio' ) }</span>
						</div>	
						<div className="flex-1 flex flex-col overflow-y-auto">
							<h3 className="text-white font-semibold text-xl px-8">{ __( 'FSE Studio', 'fse-studio' ) }</h3>
							<nav className="flex-1 px-4 py-4 space-y-1">
								{navigation.map((item) => (
									<button
										key={item.name}
										onClick={() => {
											currentView.set( item.slug );
										}}
										className={classNames(
											item.slug === currentView.currentView ? 'bg-wp-blue text-white hover:text-white' : 'text-white opacity-70 hover:text-white hover:opacity-100',
											'group flex items-center px-4 py-2 text-sm font-medium rounded-sm'
										)}
									>
										<Icon 
											className={classNames(
												item.current ? 'text-white' : 'text-white opacity-70 group-hover:opacity-100 group-hover:text-white',
												'mr-3 flex-shrink-0 h-6 w-6 fill-current'
											)}
											icon={ item.icon } 
											size={ 24 }
										/>
										{item.name}
									</button>
								))}
							</nav>
						</div>
					</div>
				</div>
				<div className={`md:pl-80 flex flex-col ${sidebarOpen ? "md:pl-80" : "md:pl-0"}`}>
					<div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
						<button
							type="button"
							className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
							onClick={() => setSidebarOpen(true)}
						>
							<span className="sr-only">Open sidebar</span>
							<Icon className='fill-current' icon={ menu } size={ 30 }/>
						</button>
						<div className="flex-1 flex">
							<div className="flex items-stretch w-full">
								<button 
									className={`bg-wp-black px-3 ${sidebarOpen ? "hidden" : ""}`}
									onClick={() => setSidebarOpen(true)}
								>
									<Icon className='text-white fill-current' icon={ wordpress } size={ 36 }/>
									
								</button>
								{/* Additional dropdown */}
								<Menu as="div" className="ml-3 relative self-center">
									<div>
										<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
											Export Theme
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="origin-center absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
											{userNavigation.map((item) => (
												<Menu.Item key={item.name}>
													{({ active }) => (
														<a
															href={item.href}
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															{item.name}
														</a>
													)}
												</Menu.Item>
											))}
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>

					<main className="flex-1">
						{ renderCurrentView() }
					</main>
				</div>
			</div>
		</>
	)
}

function ThemeManager({visible}) {
	const { themes } = useContext( FseStudioContext );
	const [ currentThemeId, setCurrentThemeId ] = useState();
	const theme = useThemeData( currentThemeId, themes );
	
	function renderThemeSelector() {
		const renderedThemes = [];

		renderedThemes.push(
			<option key={ 1 }>
				{ __( 'Choose a theme', 'fse-studio' ) }
			</option>
		);

		let counter = 3;

		for ( const theme in themes.themes ) {
			const themeInQuestion = themes.themes[ theme ];
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
					value={ currentThemeId }
					onChange={ ( event ) => {
						setCurrentThemeId( event.target.value );
					} }
				>
					{ renderedThemes }
				</select>
			</>
		);
	}
	
	function renderThemeEditorWhenReady() {
		if ( ! theme.data ) {
			return '';
		}

		return <ThemeDataEditor theme={ theme } />;
	}

	return (
		<>
		<div hidden={!visible} className="fsestudio-theme-manager p-12">
			<div className="max-w-7xl mx-auto bg-white">
				<h1 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">{ __( 'Dashboard', 'fse-studio' ) }</h1>
				<div className="px-4 sm:px-6 md:px-8 bg-[#F8F8F8] py-8 flex sm:flex-row flex-col items-end">
					<div>
						<label htmlFor="location" className="block text-sm font-medium text-gray-700">
							{ __( 'Choose a theme', 'fse-studio' ) }
						</label>
						{ renderThemeSelector() }
					</div>
					<div className="flex flex-col mx-6 my-2.5">
						{ __( 'or', 'fse-studio' ) }
					</div>
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
									tags: [],
									tested_up_to: '5.9',
									requires_wp: '5.9',
									requires_php: '7.4',
									version: '1.0.0',
									text_domain: 'my-new-theme',
									included_patterns: [],
									'index.html': '',
									'404.html': '',
								};
		
								themes.setThemes( {
									...themes.themes,
									'my-new-theme': newThemeData,
								} );
		
								// Switch to the newly created theme.
								setCurrentThemeId( 'my-new-theme' );
							} }
						>
							{ __( 'Create a new theme', 'fse-studio' ) }
						</button>
					</div>
				</div>
				{ renderThemeEditorWhenReady () }
			</div>
		</div>
		</>
	)
}

function ThemeDataEditor({theme}) {
	const { patterns } = useContext( FseStudioContext );
	const [currentView, setCurrentView] = useState('theme_setup');
	const [selectedPatterns, setSelectedPatterns] = useState({});
	const views = [
		{ name:  __( 'Theme Setup', 'fse-studio' ), slug: 'theme_setup', icon: file, current: true },
		{ name:  __( 'Add Patterns', 'fse-studio' ), slug: 'add_patterns', icon: layout, current: false },
		{ name:  __( 'Customize Styles', 'fse-studio' ), slug: 'customize_styles', icon: globe, current: false },
	]

	function formatPatternValuesForSelect() {
		const options = [];
		for ( const patternNum in theme.data.includedPatterns ) {
			const patternId = theme.data.includedPatterns[ patternNum ];
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
	
	function maybeRenderAddPatternsView() {
		if ( currentView === 'add_patterns' ) {
			return (
				<Modal title="Pick the patterns to include in this theme" onRequestClose={ () => { setCurrentView( 'theme_setup' ) } }>
					<PatternPicker 
						patterns={patterns.patterns}
						selectedPatterns={selectedPatterns}
						setSelectedPatterns={setSelectedPatterns}
						layoutPreview={LayoutPreview}
						selectMultiple={true}
					/>
				</Modal>
			)
		}
	}
	
	function maybeRenderCustomizeStylesView() {
	
	}

	function maybeRenderThemeSetupView() {
		return (
			<div hidden={currentView !== 'theme_setup'} className="flex-1">
				<form className="divide-y divide-gray-200">
					<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center pt-0">
						<label htmlFor="theme-name" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="directory-name" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="namespace" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="uri" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="author" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="author-uri" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="tags" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="tested" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="minimum-wp" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="minimum-php" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="version" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
						<label htmlFor="text-domain" className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
		)
		
	}

	return (
		<>
		<div className="flex flex-row px-4 sm:px-6 md:px-8 py-8 gap-14">
			<ul className="w-72">
				{views.map((item) => (
					<li key={item.name}>
						<button
							className={'w-full text-left p-5 font-medium' + ( currentView === item.slug ? ' bg-gray-100' : ' hover:bg-gray-100' )}
							key={item.name}
							onClick={() => {
								setCurrentView( item.slug );
							}}
						>
							{ item.name }
						</button>
					</li>
				))}
			</ul>
			{ maybeRenderThemeSetupView() }
			{ maybeRenderAddPatternsView() }
			{ maybeRenderCustomizeStylesView() }
			<div className="w-72 bg-gray-100 p-5 self-start">
				<h3>Sidebar</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac purus nec diam laoreet sollicitudin. Fusce ullamcorper imperdiet turpis, non accumsan enim egestas in.</p>
			</div>
		</div>
		<div className="p-5 text-xl border-t border-gray-200 px-4 sm:px-6 md:px-8 flex justify-between items-center">
			<button
				type="button"
				className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
			>
				<Icon className='fill-current mr-2' icon={ download } size={ 24 }/>
				{ __( 'Export theme to zip', 'fse-studio' ) }
			</button>

			<div className="flex items-center">
				{(() => {
					if ( theme.hasSaved ) {
						return <span className="text-sm text-green-600 flex flex-row items-center mr-6"><Icon className='fill-current' icon={ check } size={ 26 }/> { __( 'Theme saved to your /themes/ folder', 'fse-studio' ) }</span>
					}
				})()}
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
	)
}
