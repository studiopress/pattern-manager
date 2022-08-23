// WP Dependencies.
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';
import classNames from '../../utils/classNames';
import Container from './Container';
import CreateTheme from './CreateTheme';
import SaveTheme from './SaveTheme';
import ThemeCreatedNotice from './ThemeCreatedNotice';
import ThemeDetails from './ThemeDetails';
import ThemeOverview from './ThemeOverview';

const Tabs = {
	ThemeOverview: 0,
	EditThemeDetails: 1,
};

/** @param {{isVisible: boolean}} props */
export default function ThemeSetup( { isVisible } ) {
	const { currentTheme, currentView } = useStudioContext();
	const [ currentTab, setCurrentTab ] = useState( Tabs.ThemeOverview );
	const [ displayThemeCreatedNotice, setDisplayThemeCreatedNotice ] =
		useState( false );

	useEffect( () => {
		setDisplayThemeCreatedNotice( false );
	}, [ currentTab, currentView?.currentView ] );

	if ( ! currentTheme.data || ! isVisible ) {
		return null;
	}

	return currentTheme.existsOnDisk ? (
		<Container
			heading={ sprintf(
				/* translators: %1$s: The theme name */
				__( 'Theme: %1$s', 'fse-studio' ),
				currentTheme?.data?.name ?? ''
			) }
			description={ __(
				'Here you will find everything you need to customize your full-site editing theme. Visit the Edit Theme Details tab to see advanced options.',
				'fsestudio'
			) }
		>
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
										setCurrentTab( Tabs.EditThemeDetails );

										if ( ! currentTheme.existsOnDisk ) {
											setDisplayThemeCreatedNotice(
												true
											);
										}
									} }
								>
									{ __( 'Edit Theme Details', 'fse-studio' ) }
								</button>
							</li>
						</ul>
					</div>
				</div>
				<div className="mx-auto p-8 lg:p-12">
					{ currentTab === Tabs.ThemeOverview ? (
						<>
							{ displayThemeCreatedNotice ? (
								<ThemeCreatedNotice
									onDismiss={ () => {
										setDisplayThemeCreatedNotice( false );
									} }
								/>
							) : null }
							<ThemeOverview />
						</>
					) : null }
					{ currentTab === Tabs.EditThemeDetails ? (
						<>
							<ThemeDetails />
							<SaveTheme />
						</>
					) : null }
				</div>
			</>
		</Container>
	) : (
		<Container
			isVisible={ isVisible }
			heading={ __( 'Create Your Theme', 'fse-studio' ) }
			description={ __(
				'To get started, enter a theme name and click Save Your Theme. Once your theme is created, you can move on to building and customizing your theme.',
				'fsestudio'
			) }
		>
			<CreateTheme>
				<SaveTheme
					displayCancelButton={ true }
					setDisplayThemeCreatedNotice={
						setDisplayThemeCreatedNotice
					}
				/>
			</CreateTheme>
		</Container>
	);
}
