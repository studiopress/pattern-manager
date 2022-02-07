/**
 * Fse Studio
 */

const { __ } = wp.i18n;

import './../../css/src/index.scss';
import './../../css/src/tailwind.css';

import { useContext,  Fragment, useState } from '@wordpress/element';
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
	chevronLeft
} from '@wordpress/icons';

import {
	FseStudioContext,
	useThemes,
	usePatterns,
	useThemeJsonFiles,
	useCurrentView,
} from './non-visual/non-visual-logic.js';

import { PatternEditorApp } from './visual/PatternEditor.js';
import { ThemeJsonEditorApp } from './visual/ThemeJsonEditor.js';

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
				siteUrl: fsestudio.siteUrl,
				apiEndpiints: fsestudio.api_endpoints,
			} }
		>
			<FseStudio />
		</FseStudioContext.Provider>
	);
}

function FseStudio() {
	const { currentView } = useContext( FseStudioContext );
	const [sidebarOpen, setSidebarOpen] = useState(false)

	const navigation = [
		{ name: 'Theme Manager', slug: 'theme_manager', icon: file, current: true },
		{ name: 'Pattern Manager', slug: 'pattern_manager', icon: layout, current: false },
		{ name: 'Theme.json Manager', slug: 'themejson_manager', icon: globe, current: false },
	]
	
	function renderCurrentView() {
		if ( 'theme_manager' === currentView.currentView ) {
			return <ThemeManager />;
		}
		if ( 'pattern_manager' === currentView.currentView ) {
			return <PatternManager />;
		}
		if ( 'themejson_manager' === currentView.currentView ) {
			return <ThemeJsonEditorApp />;
		}
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

function PatternManager() {
	return <PatternEditorApp />
}
function ThemeManager() {
	
	return (
		<>
		<div className="p-12">
			<div className="max-w-7xl mx-auto bg-white">
				<h1 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">{ __( 'Dashboard', 'fse-studio' ) }</h1>
				<div className="px-4 sm:px-6 md:px-8 bg-[#F8F8F8] py-8">{ __( 'Choose a theme', 'fse-studio' ) }</div>
				<div className="flex flex-row px-4 sm:px-6 md:px-8 py-8 gap-14">
					<ul className="w-72">
						<li className="p-5 bg-gray-100 font-medium">{ __( 'Theme Setup', 'fse-studio' ) }</li>
						<li className="p-5 font-medium hover:bg-gray-100">{ __( 'Add Patterns', 'fse-studio' ) }</li>
						<li className="p-5 font-medium hover:bg-gray-100">{ __( 'Customize Styles', 'fse-studio' ) }</li>
					</ul>
					<div className="flex-1">
						<form className="divide-y divide-gray-200">
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center pt-0">
								<label htmlFor="theme-name" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Theme Name', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="theme-name"
										id="theme-name"
										placeholder="FSE Studio"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>
							
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="directory-name" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Directory Name', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="directory-name"
										id="directory-name"
										placeholder="fse-studio"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="namespace" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Namespace', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="namespace"
										id="namespace"
										placeholder="fsestudio"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="uri" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'URI', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="uri"
										id="uri"
										placeholder="yourthemename.com"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="author" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Author', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="author"
										id="author"
										placeholder="Your Name"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="author-uri" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Author URI', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="author-uri"
										id="author-uri"
										placeholder="yourthemesite.com"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Description', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="description"
										id="description"
										placeholder="Describe this theme"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="tags" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Tags (comma separated', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="tags"
										id="tags"
										placeholder="fse, studio, wordpress"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="tested" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Tested up to (WP Version)', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="tested"
										id="tested"
										placeholder="5.9"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="minimum-wp" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Minimum WP Version', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="minimum-wp"
										id="minimum-wp"
										placeholder="5.9"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="minimum-php" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Minimum PHP Version', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="minimum-php"
										id="minimum-php"
										placeholder="7.4"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="version" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Version', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="version"
										id="version"
										placeholder="1.0"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
								<label htmlFor="text-domain" className="block text-sm font-medium text-gray-700 sm:col-span-1">
									{ __( 'Text Domain', 'fse-studio' ) }
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="text"
										name="text-domain"
										id="text-domain"
										placeholder="fse-studio"
										className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
									/>
								</div>
							</div>

						</form>
					</div>
					<div className="w-72 bg-gray-100 p-5 self-start">
						<h3>Sidebar</h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac purus nec diam laoreet sollicitudin. Fusce ullamcorper imperdiet turpis, non accumsan enim egestas in.</p>
					</div>
				</div>
				<div className="p-5 text-xl border-t border-gray-200 px-4 sm:px-6 md:px-8">
					<button
						type="button"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
					>
						{ __( 'Save Theme Settings', 'fse-studio' ) }
					</button>
				</div>
			</div>
		</div>
		</>
	)
}
