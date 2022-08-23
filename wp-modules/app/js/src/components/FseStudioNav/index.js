// @ts-check

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

// Context
import useStudioContext from '../../hooks/useStudioContext';

// Submenu
import MenuOpenTheme from './MenuOpenTheme';
import MenuCreateTheme from './MenuCreateTheme';
import MenuExitFses from './MenuExitFses';
import MenuThemeOverview from './MenuThemeOverview';
import MenuThemeExport from './MenuThemeExport';
import MenuStylesSettings from './MenuStylesSettings';
import MenuPatterns from './MenuPatterns';
import MenuTemplates from './MenuTemplates';
import MenuTemplateParts from './MenuTemplateParts';

// Images
// @ts-ignore
import dropMenuIcon from '../../../../img/drop-arrow.svg';

export default function FseStudioNav() {
	const { currentView, currentTheme } = useStudioContext();

	return (
		<nav role="navigation" className="fses-nav">
			<ul className="font-medium">
				<li>
					<button aria-haspopup="true" className="flex items-center">
						{ __( 'FSE Studio', 'fse-studio' ) }{ ' ' }
						<img
							alt="drop icon"
							className="ml-2"
							src={ dropMenuIcon }
						/>
					</button>
					<ul className="dropdown" aria-label="submenu">
						<li>
							<MenuOpenTheme />
						</li>
						<li>
							<MenuCreateTheme />
						</li>
						<li>
							<MenuExitFses />
						</li>
					</ul>
				</li>
				{ currentTheme?.existsOnDisk ? (
					<>
						<li>
							<button
								type="button"
								className={
									'focus:outline-none focus:ring-1 focus:ring-wp-blue flex items-center' +
									( currentView?.currentView === 'theme_setup'
										? ' bg-[#404040]'
										: '' )
								}
								onClick={ () => {
									currentView?.set( 'theme_setup' );
								} }
							>
								{ __( 'Current Theme', 'fse-studio' ) }{ ' ' }
								<img
									alt="drop icon"
									className="ml-2"
									src={ dropMenuIcon }
								/>
							</button>

							<ul className="dropdown" aria-label="submenu">
								<li>
									<MenuThemeOverview />
								</li>
								<li>
									<MenuThemeExport />
								</li>
							</ul>
						</li>
						<li>
							<MenuStylesSettings />
						</li>
						<li>
							<MenuPatterns />
						</li>
						<li>
							<MenuTemplates />
						</li>
						<li>
							<MenuTemplateParts />
						</li>
					</>
				) : null }
			</ul>
		</nav>
	);
}
