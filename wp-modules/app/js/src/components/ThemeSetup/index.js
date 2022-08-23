// WP Dependencies.
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';
import ThemeDetails from '../ThemeDetails';

import imgThemeTemplate from '../../../../img/theme-templates.svg';
import imgThemeTemplateParts from '../../../../img/theme-template-parts.svg';
import imgThemePatterns from '../../../../img/theme-patterns.svg';
import imgThemeJson from '../../../../img/theme-themejson.svg';
import imgThemeStyleVariations from '../../../../img/theme-style-variations.svg';
import imgThemeExport from '../../../../img/theme-export.svg';
import CreateTheme from '../CreateTheme';
import classNames from '../../utils/classNames';

const Tabs = {
	ThemeOverview: 0,
	EditThemeDetails: 1,
};

/** @param {{isVisible: boolean}} props */
export default function ThemeSetup( { isVisible } ) {
	const { currentTheme, currentView } = useStudioContext();
	const [ currentTab, setCurrentTab ] = useState( Tabs.ThemeOverview );

	if ( ! currentTheme.data ) {
		return '';
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

			{ currentTheme.existsOnDisk && (
				<div className="bg-fses-gray">
					<div className="mx-auto max-w-7xl">
						<ul className="flex m-0 gap-2">
							<li className="m-0">
								<button
									type="button"
									className={ classNames(
										'font-medium py-3 px-5 rounded-t',
										currentTab === Tabs.ThemeOverview
											? 'bg-white'
											: 'hover:bg-white'
									) }
									onClick={ () => {
										setCurrentTab( Tabs.ThemeOverview );
									} }
								>
									{ __( 'Theme Overview', 'fse-studio' ) }
								</button>
							</li>
							<li className="m-0">
								<button
									type="button"
									className={ classNames(
										'font-medium py-3 px-5 rounded-t',
										currentTab === Tabs.EditThemeDetails
											? 'bg-white'
											: 'hover:bg-white'
									) }
									onClick={ () => {
										setCurrentTab( Tabs.EditThemeDetails );
									} }
								>
									{ __( 'Edit Theme Details', 'fse-studio' ) }
								</button>
							</li>
						</ul>
					</div>
				</div>
			) }

			<div className="mx-auto p-8 lg:p-12">
				{ ! currentTheme.existsOnDisk ? <CreateTheme /> : null }
				{ currentTheme.existsOnDisk &&
				currentTab === Tabs.ThemeOverview ? (
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
											{ __(
												'Template Parts',
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
													'template_parts'
												);
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
											{ __(
												'Theme Patterns',
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
													'theme_patterns'
												);
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
											{ __(
												'Download Theme',
												'fse-studio'
											) }
										</button>
									</div>
								</div>
								<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
									You can also view your theme files
								</div>
							</div>
						</div>
					</div>
				) : null }
				{ currentTheme.existsOnDisk &&
				currentTab === Tabs.EditThemeDetails ? (
					<ThemeDetails />
				) : null }
			</div>
		</div>
	);
}
