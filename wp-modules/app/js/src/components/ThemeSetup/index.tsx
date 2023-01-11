// WP Dependencies.
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import usePmContext from '../../hooks/usePmContext';
import useNoticeContext from '../../hooks/useNoticeContext';
import classNames from '../../utils/classNames';
import ViewContainer from '../Common/ViewContainer';
import SaveTheme from '../Common/SaveTheme';
import ThemeCreatedNotice from './ThemeCreatedNotice';
import ThemeDetails from '../Common/ThemeDetails';
import ThemeOverview from './ThemeOverview';

import { Tabs } from '../../enums';

type Props = {
	isVisible: boolean;
};

export default function ThemeSetup( { isVisible }: Props ) {
	const { currentTheme } = usePmContext();
	const { displayThemeCreatedNotice } = useNoticeContext();
	const [ currentTab, setCurrentTab ] = useState( Tabs.ThemeOverview );

	if ( ! currentTheme.data || ! isVisible ) {
		return null;
	}

	return (
		<ViewContainer
			heading={ sprintf(
				/* translators: %1$s: The theme name */
				__( 'Theme: %1$s', 'pattern-manager' ),
				currentTheme?.data?.name ?? ''
			) }
			description={ __(
				'Here you will find everything you need to customize your full-site editing theme. Visit the Edit Theme Details tab to see advanced options.',
				'patternmanager'
			) }
		>
			<>
				<div className="bg-pm-gray">
					<div className="mx-auto max-w-7xl">
						<ul className="flex m-0 gap-2 px-8 xl:p-0">
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
									{ __(
										'Theme Overview',
										'pattern-manager'
									) }
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
									{ __(
										'Edit Theme Details',
										'pattern-manager'
									) }
								</button>
							</li>
						</ul>
					</div>
				</div>
				<div className="mx-auto p-8 xl:p-0 max-w-7xl xl:mt-16 mt-8 mb-24">
					{ currentTab === Tabs.ThemeOverview ? (
						<>
							{ displayThemeCreatedNotice ? (
								<ThemeCreatedNotice />
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
		</ViewContainer>
	);
}
