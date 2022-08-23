// WP Dependencies.
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';
import ThemeDetails from './ThemeDetails';
import CreateTheme from './CreateTheme';
import ThemeOverview from './ThemeOverview';
import classNames from '../../utils/classNames';
import SaveTheme from './SaveTheme';

const Tabs = {
	ThemeOverview: 0,
	EditThemeDetails: 1,
};

/** @param {{isVisible: boolean}} props */
export default function ThemeSetup( { isVisible } ) {
	const { currentTheme } = useStudioContext();
	const [ currentTab, setCurrentTab ] = useState( Tabs.ThemeOverview );

	if ( ! currentTheme.data ) {
		return null;
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

			{ ! currentTheme.existsOnDisk ? (
				<CreateTheme />
			) : (
				<>
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
											setCurrentTab(
												Tabs.EditThemeDetails
											);
										} }
									>
										{ __(
											'Edit Theme Details',
											'fse-studio'
										) }
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div className="mx-auto p-8 lg:p-12">
						{ currentTab === Tabs.ThemeOverview ? (
							<ThemeOverview />
						) : null }
						{ currentTab === Tabs.EditThemeDetails ? (
							<>
								<ThemeDetails />
								<SaveTheme />
							</>
						) : null }
					</div>
				</>
			) }
			<div className="flex-1 w-full md:w-1/3 text-base">
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
		</div>
	);
}
