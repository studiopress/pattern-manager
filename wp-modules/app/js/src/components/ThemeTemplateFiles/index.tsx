/* eslint-disable no-undef */

// WP Dependencies.
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';

// Components
import ThemeTemplatePicker from '../ThemeTemplatePicker';

type Props = {
	isVisible: boolean;
};

export default function ThemeTemplateFiles( { isVisible }: Props ) {
	const { currentTheme } = useStudioContext();
	const [ currentTab, setCurrentTab ] = useState( 'templates' );

	if ( ! currentTheme.data ) {
		return '';
	}

	const standardTemplates = {
		'front-page': {
			title: __( 'Template: front-page.html', 'fse-studio' ),
			description: __(
				'This template is used when someone goes to the exact URL of your site.',
				'fse-studio'
			),
		},
		index: {
			title: __( 'Template: index.html', 'fse-studio' ),
			description: __(
				'This template is used as a fallback to show anything if no other template applies.',
				'fse-studio'
			),
		},
		404: {
			title: __( 'Template: 404.html', 'fse-studio' ),
			description: __(
				'This template is used when the URL does not match anything on the website.',
				'fse-studio'
			),
		},
		archive: {
			title: __( 'Template: archive.html', 'fse-studio' ),
			description: __(
				'This template is used when viewing a whole page of posts.',
				'fse-studio'
			),
		},
		single: {
			title: __( 'Template: single.html', 'fse-studio' ),
			description: __(
				'This template is used when viewing a single post.',
				'fse-studio'
			),
		},
		page: {
			title: __( 'Template: page.html', 'fse-studio' ),
			description: __(
				'This template is used when viewing a single page.',
				'fse-studio'
			),
		},
		search: {
			title: __( 'Template: search.html', 'fse-studio' ),
			description: __(
				'This template is used to show search results when the viewer performs a search in your WordPress site.',
				'fse-studio'
			),
		},
	};

	const standardTemplateParts = {
		header: {
			title: __( 'Template Part: header.html', 'fse-studio' ),
			description: __(
				'This template is used for the header.',
				'fse-studio'
			),
		},
		footer: {
			title: __( 'Template Part: footer.html', 'fse-studio' ),
			description: __(
				'This template is used for the footer.',
				'fse-studio'
			),
		},
	};

	const tabs = [
		{
			name: __( 'Template Parts', 'fse-studio' ),
			slug: 'template-parts',
		},
		{
			name: __( 'Templates', 'fse-studio' ),
			slug: 'templates',
		},
	];

	return (
		<div hidden={ ! isVisible } className="flex-1">
			<div className="bg-fses-gray mx-auto p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">
						{ __( 'Templates', 'fse-studio' ) }
					</h1>
					<p className="text-lg max-w-2xl">
						Here, you can set up the various default pages that make
						up your theme. Not all pages are required, and some
						pages can act as a fallback for all pages.
					</p>
				</div>
			</div>

			<div className="mx-auto p-8 lg:p-12">
				<div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10 lg:gap-20">
					<div className="flex-initial w-full md:w-2/3">
						<div className="flex flex-col gap-14">
							<ul className="w-full inline-flex text-base fses-json-nav">
								{ tabs.map( ( item ) => (
									<li key={ item.name }>
										<button
											className={
												'w-full text-left p-5 font-medium rounded-sm' +
												( currentTab === item.slug
													? ' bg-gray-100'
													: ' hover:bg-gray-100' )
											}
											key={ item.name }
											onClick={ () => {
												setCurrentTab( item.slug );
											} }
										>
											{ item.name }
										</button>
									</li>
								) ) }
							</ul>
						</div>
						{ currentTab === 'templates' ? (
							<div className="divide-y divide-gray-200 flex flex-col justify-between">
								{ Object.entries( standardTemplates ?? {} ).map(
									( [ templateName ] ) => {
										return (
											<ThemeTemplatePicker
												key={ templateName }
												templateName={ templateName }
												templateData={
													currentTheme.data
														?.template_files
														? currentTheme.data
																?.template_files[
																templateName
														  ]
														: ''
												}
												standardTemplates={
													standardTemplates
												}
												existsInTheme={ currentTheme.data?.template_files.hasOwnProperty(
													templateName
												) }
												type={ 'template' }
											/>
										);
									}
								) }
								{ Object.entries(
									currentTheme.data?.template_files ?? {}
								).map( ( [ templateName ] ) => {
									// Skip any we've already rendered above (standardTemplates).
									if (
										! standardTemplates.hasOwnProperty(
											templateName
										)
									) {
										return (
											<ThemeTemplatePicker
												key={ templateName }
												templateName={ templateName }
												templateData={
													currentTheme.data
														?.template_files
														? currentTheme.data
																?.template_files[
																templateName
														  ]
														: ''
												}
												standardTemplates={
													standardTemplates
												}
												existsInTheme={ currentTheme.data?.template_files.hasOwnProperty(
													templateName
												) }
												type={ 'template' }
											/>
										);
									}

									return '';
								} ) }
							</div>
						) : null }
						{ currentTab === 'template-parts' ? (
							<div className="divide-y divide-gray-200 flex flex-col justify-between">
								{ Object.entries(
									standardTemplateParts ?? {}
								).map( ( [ templateName ] ) => {
									return (
										<ThemeTemplatePicker
											key={ templateName }
											templateName={ templateName }
											templateData={
												currentTheme.data
													?.template_parts
													? currentTheme.data
															?.template_parts[
															templateName
													  ]
													: ''
											}
											standardTemplates={
												standardTemplateParts
											}
											existsInTheme={ currentTheme.data?.template_parts?.hasOwnProperty(
												templateName
											) }
											type={ 'template_part' }
										/>
									);
								} ) }
								{ Object.entries(
									currentTheme.data?.template_parts ?? {}
								).map( ( [ templateName ] ) => {
									// Skip any we've already rendered above (standardTemplateParts).
									if (
										! standardTemplateParts.hasOwnProperty(
											templateName
										)
									) {
										return (
											<ThemeTemplatePicker
												key={ templateName }
												templateName={ templateName }
												templateData={
													currentTheme.data
														?.template_parts
														? currentTheme.data
																?.template_parts[
																templateName
														  ]
														: ''
												}
												standardTemplates={
													standardTemplateParts
												}
												existsInTheme={ currentTheme.data?.template_parts?.hasOwnProperty(
													templateName
												) }
												type={ 'template_part' }
											/>
										);
									}

									return '';
								} ) }
							</div>
						) : null }
					</div>

					<div className="flex-1 w-full md:w-1/3 text-base">
						<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded">
							<div>
								<h4 className="mb-2 font-medium">
									Setting up templates
								</h4>
								<p className="text-base">
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit, sed do eiusmod tempor
									incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud
									exercitation ullamco laboris nisi ut aliquip
									ex ea commodo consequat.{ ' ' }
								</p>
							</div>
							<div>
								<h4 className="mb-2 font-medium">
									Helpful Documentation
								</h4>
								<ul>
									<li>
										<a className="text-wp-blue" href="/">
											Full Site Editing Documentation
										</a>
									</li>
									<li>
										<a className="text-wp-blue" href="/">
											About Full Site Editing Themes
										</a>
									</li>
									<li>
										<a
											className="text-wp-blue"
											href="https://developer.wordpress.org/themes/basics/template-hierarchy/"
										>
											{ __(
												'Theme Template Hierarchy',
												'fse-studio'
											) }
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
