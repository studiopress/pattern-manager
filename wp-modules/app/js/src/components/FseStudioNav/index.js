/* eslint-disable react/no-unknown-property */

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

import { fsestudio } from '../../globals';

// Context
import useStudioContext from '../../hooks/useStudioContext';

// Utils
import createNewTheme from '../../utils/createNewTheme';
import switchThemeOnBackEnd from '../../utils/switchThemeOnBackEnd';

// Images
import dropMenuIcon from '../../../../img/drop-arrow.svg';
import dropMenuIconRight from '../../../../img/drop-arrow-right.svg';

export default function FseStudioNav() {
	const {
		currentView,
		currentTheme,
		themes,
		currentThemeId,
		patterns,
		patternEditorIframe,
		templateEditorIframe,
	} = useStudioContext();

	/**
	 * Post a window message in certain conditions.
	 *
	 * Main purpose here is to throw notice for user to refresh editor.
	 * Currently targets pattern and template editors.
	 *
	 * @param {string} message
	 */
	function maybePostWindowMessage( message ) {
		if ( patternEditorIframe?.current ) {
			patternEditorIframe.current.contentWindow.postMessage(
				JSON.stringify( {
					message,
				} ),
				'*'
			);
		}

		if ( templateEditorIframe?.current ) {
			templateEditorIframe.current.contentWindow.postMessage(
				JSON.stringify( {
					message,
				} )
			);
		}
	}

	/**
	 * Render a list of FSES themes for selection.
	 * Hide if no themes are available.
	 */
	function MenuOpenTheme() {
		const listMenuOptions = ( items ) => {
			return Object.keys( items ).map( ( key ) => {
				const name =
					currentThemeId?.value === key
						? `${ items[ key ]?.name } (Active)`
						: items[ key ]?.name;

				return items[ key ]?.name ? (
					<li key={ key }>
						<button
							type="button"
							onClick={ () => {
								currentThemeId?.set( key );
								switchThemeOnBackEnd(
									items[ key ]?.dirname
								).then( () => {
									patterns?.reloadPatternPreviews();
								} );
								maybePostWindowMessage(
									'fsestudio_hotswapped_theme'
								);

								/**
								 * Existing FSES theme was selected from nav in SaveTheme.
								 * This action should effectively act as a cancel.
								 */
								if (
									'create_theme' === currentView?.currentView
								) {
									currentView?.set( 'theme_setup' );
								}
							} }
						>
							{ name }
						</button>
					</li>
				) : null;
			} );
		};

		return (
			// In order to render the selector…
			// There should be at least 1 theme other than the currently selected theme.
			// Or the current theme should have been saved to disk.
			Object.keys( themes?.themes || {} ).some(
				( themeName ) => themeName !== currentThemeId?.value
			) ? (
				<>
					<button
						aria-haspopup="true"
						className="flex justify-between items-center"
					>
						<span className="flex items-center gap-4">
							<svg
								aria-hidden="true"
								width="13"
								height="10"
								viewBox="0 0 13 10"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M11.7812 1.875H6.90625L5.50977 0.503906C5.35742 0.351562 5.1543 0.25 4.92578 0.25H1.21875C0.533203 0.25 0 0.808594 0 1.46875V8.78125C0 9.4668 0.533203 10 1.21875 10H11.7812C12.4414 10 13 9.4668 13 8.78125V3.09375C13 2.43359 12.4414 1.875 11.7812 1.875ZM11.7812 8.78125H1.21875V1.46875H4.77344L6.14453 2.86523C6.29688 3.01758 6.5 3.09375 6.72852 3.09375H11.7812V8.78125Z"
									fill="#969696"
								/>
							</svg>
							{ __( 'Open Theme', 'fse-studio' ) }
						</span>
						<img
							aria-hidden="true"
							alt=""
							className="ml-2"
							src={ dropMenuIconRight }
						/>
					</button>

					<ul className="dropdown" aria-label="submenu">
						{ listMenuOptions( themes?.themes ) }
					</ul>
				</>
			) : null
		);
	}

	return (
		<nav className="fses-nav" aria-label="Main Menu">
			<ul className="font-medium">
				<li>
					<button aria-haspopup="true" className="flex items-center">
						{ __( 'FSE Studio', 'fse-studio' ) }{ ' ' }
						<img
							aria-hidden="true"
							alt=""
							className="ml-2"
							src={ dropMenuIcon }
						/>
					</button>
					<ul className="dropdown" aria-label="submenu">
						<li>
							{ /* Render the theme names */ }
							<MenuOpenTheme />
						</li>
						<li>
							<button
								className="flex items-center gap-4"
								type="button"
								onClick={ () => {
									createNewTheme( themes, currentThemeId );
									currentView?.set( 'create_theme' );
								} }
							>
								<svg
									aria-hidden="true"
									width="15"
									height="14"
									viewBox="0 0 15 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M10.207 9.38477C10.1562 9.43555 10.1562 9.48633 10.1562 9.53711V12.4062H1.21875V3.46875H7.33789C7.38867 3.46875 7.43945 3.46875 7.49023 3.41797L8.30273 2.60547C8.42969 2.47852 8.32812 2.25 8.15039 2.25H1.21875C0.533203 2.25 0 2.80859 0 3.46875V12.4062C0 13.0918 0.533203 13.625 1.21875 13.625H10.1562C10.8164 13.625 11.375 13.0918 11.375 12.4062V8.72461C11.375 8.54688 11.1465 8.44531 11.0195 8.57227L10.207 9.38477ZM14.168 4.28125C14.752 3.69727 14.752 2.75781 14.168 2.17383L13.0762 1.08203C12.4922 0.498047 11.5527 0.498047 10.9688 1.08203L4.31641 7.73438L4.0625 10.0449C3.98633 10.7051 4.54492 11.2637 5.20508 11.1875L7.51562 10.9336L14.168 4.28125ZM11.6797 5.04297L6.95703 9.76562L5.28125 9.96875L5.48438 8.29297L10.207 3.57031L11.6797 5.04297ZM13.3047 3.03711C13.4316 3.13867 13.4316 3.29102 13.3301 3.41797L12.543 4.20508L11.0703 2.70703L11.832 1.94531C11.9336 1.81836 12.1113 1.81836 12.2129 1.94531L13.3047 3.03711Z"
										fill="#969696"
									/>
								</svg>
								{ __( 'Create New Theme', 'fse-studio' ) }
							</button>
						</li>
						<li>
							<button
								className="flex items-center gap-4"
								type="button"
								onClick={ () => {
									window.location.href = fsestudio.adminUrl;
								} }
							>
								<svg
									aria-hidden="true"
									className="ml-[2px]"
									width="14"
									height="12"
									viewBox="0 0 14 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M6.90625 2.46875V3.78906H4.46875C3.7832 3.78906 3.25 4.34766 3.25 5.00781V7.26758C3.25 7.92773 3.7832 8.48633 4.46875 8.48633H6.90625V9.78125C6.90625 10.873 8.20117 11.4062 8.96289 10.6445L12.6191 6.98828C13.1016 6.53125 13.1016 5.74414 12.6191 5.26172L8.96289 1.60547C8.20117 0.84375 6.90625 1.40234 6.90625 2.46875ZM11.7812 6.125L8.125 9.78125V7.26758H4.46875V5.00781H8.125V2.46875L11.7812 6.125ZM2.4375 1.25C1.0918 1.25 0 2.3418 0 3.6875V8.5625C0 9.9082 1.0918 11 2.4375 11H4.57031C4.72266 11 4.875 10.873 4.875 10.6953V10.0859C4.875 9.93359 4.72266 9.78125 4.57031 9.78125H2.4375C1.75195 9.78125 1.21875 9.24805 1.21875 8.5625V3.6875C1.21875 3.02734 1.75195 2.46875 2.4375 2.46875H4.57031C4.72266 2.46875 4.875 2.3418 4.875 2.16406V1.55469C4.875 1.40234 4.72266 1.25 4.57031 1.25H2.4375Z"
										fill="#969696"
									/>
								</svg>
								{ __( 'Exit to Dashboard', 'fse-studio' ) }
							</button>
						</li>
					</ul>
				</li>
				{ currentView?.currentView !== 'create_theme' ? (
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
									aria-hidden="true"
									alt=""
									className="ml-2"
									src={ dropMenuIcon }
								/>
							</button>

							<ul className="dropdown" aria-label="submenu">
								<li>
									<button
										type="button"
										className={
											'focus:outline-none focus:ring-1 focus:ring-wp-blue flex items-center gap-4' +
											( currentView?.currentView ===
											'theme_setup'
												? ' !text-white'
												: '' )
										}
										onClick={ () => {
											currentView?.set( 'theme_setup' );
										} }
									>
										<svg
											aria-hidden="true"
											width="14"
											height="12"
											viewBox="0 0 14 12"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M13.5938 5.51562H6.28125C6.05273 5.51562 5.875 5.71875 5.875 5.92188V6.32812C5.875 6.55664 6.05273 6.73438 6.28125 6.73438H13.5938C13.7969 6.73438 14 6.55664 14 6.32812V5.92188C14 5.71875 13.7969 5.51562 13.5938 5.51562ZM13.5938 9.57812H6.28125C6.05273 9.57812 5.875 9.78125 5.875 9.98438V10.3906C5.875 10.6191 6.05273 10.7969 6.28125 10.7969H13.5938C13.7969 10.7969 14 10.6191 14 10.3906V9.98438C14 9.78125 13.7969 9.57812 13.5938 9.57812ZM13.5938 1.45312H6.28125C6.05273 1.45312 5.875 1.65625 5.875 1.85938V2.26562C5.875 2.49414 6.05273 2.67188 6.28125 2.67188H13.5938C13.7969 2.67188 14 2.49414 14 2.26562V1.85938C14 1.65625 13.7969 1.45312 13.5938 1.45312ZM2.625 8.96875C1.96484 8.96875 1.40625 9.52734 1.40625 10.1875C1.40625 10.873 1.96484 11.4062 2.625 11.4062C3.28516 11.4062 3.84375 10.873 3.84375 10.1875C3.84375 9.52734 3.28516 8.96875 2.625 8.96875ZM4.5293 4.60156C4.47852 4.55078 4.40234 4.5 4.32617 4.5C4.22461 4.5 4.14844 4.55078 4.09766 4.60156L2.47266 6.20117L1.91406 5.64258C1.86328 5.5918 1.78711 5.56641 1.68555 5.56641C1.60938 5.56641 1.5332 5.5918 1.48242 5.64258L1.07617 6.04883C1.02539 6.09961 0.974609 6.17578 0.974609 6.25195C0.974609 6.35352 1.02539 6.42969 1.07617 6.48047L2.29492 7.67383C2.3457 7.72461 2.42188 7.75 2.49805 7.75C2.59961 7.75 2.67578 7.72461 2.72656 7.67383L3.13281 7.26758L4.96094 5.46484C5.01172 5.41406 5.03711 5.33789 5.03711 5.23633C5.03711 5.16016 5.01172 5.08398 4.96094 5.0332L4.5293 4.60156ZM4.5293 0.539062C4.47852 0.488281 4.40234 0.4375 4.32617 0.4375C4.22461 0.4375 4.14844 0.488281 4.09766 0.539062L2.47266 2.13867L1.91406 1.58008C1.86328 1.5293 1.78711 1.50391 1.68555 1.50391C1.60938 1.50391 1.5332 1.5293 1.48242 1.58008L1.07617 1.98633C1.02539 2.03711 0.974609 2.11328 0.974609 2.18945C0.974609 2.29102 1.02539 2.36719 1.07617 2.41797L2.29492 3.61133C2.3457 3.66211 2.42188 3.6875 2.49805 3.6875C2.59961 3.6875 2.67578 3.66211 2.72656 3.61133L3.13281 3.20508L4.96094 1.37695C5.01172 1.32617 5.0625 1.25 5.0625 1.17383C5.0625 1.09766 5.01172 1.02148 4.96094 0.945312L4.5293 0.539062Z"
												fill="#969696"
											/>
										</svg>
										{ __( 'Theme Overview', 'fse-studio' ) }
									</button>
								</li>
								<li>
									<button
										className="flex items-center gap-4"
										type="button"
										onClick={ () => {
											currentTheme?.export();
										} }
									>
										<svg
											aria-hidden="true"
											width="15"
											height="14"
											viewBox="0 0 15 14"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M13.4062 7.9375H11.0449L12.2383 6.76953C13 6.00781 12.4414 4.6875 11.375 4.6875H9.75V1.84375C9.75 1.18359 9.19141 0.625 8.53125 0.625H6.09375C5.4082 0.625 4.875 1.18359 4.875 1.84375V4.6875H3.25C2.1582 4.6875 1.59961 6.00781 2.38672 6.76953L3.55469 7.9375H1.21875C0.533203 7.9375 0 8.49609 0 9.15625V12.4062C0 13.0918 0.533203 13.625 1.21875 13.625H13.4062C14.0664 13.625 14.625 13.0918 14.625 12.4062V9.15625C14.625 8.49609 14.0664 7.9375 13.4062 7.9375ZM3.25 5.90625H6.09375V1.84375H8.53125V5.90625H11.375L7.3125 9.96875L3.25 5.90625ZM13.4062 12.4062H1.21875V9.15625H4.77344L6.44922 10.832C6.90625 11.3145 7.69336 11.3145 8.15039 10.832L9.82617 9.15625H13.4062V12.4062ZM11.1719 10.7812C11.1719 11.1367 11.4258 11.3906 11.7812 11.3906C12.1113 11.3906 12.3906 11.1367 12.3906 10.7812C12.3906 10.4512 12.1113 10.1719 11.7812 10.1719C11.4258 10.1719 11.1719 10.4512 11.1719 10.7812Z"
												fill="#969696"
											/>
										</svg>
										{ __( 'Download Theme', 'fse-studio' ) }
									</button>
								</li>
							</ul>
						</li>
						<li>
							<button
								disabled={ ! currentTheme?.data }
								type="button"
								className={
									'focus:outline-none focus:ring-1 focus:ring-wp-blue' +
									( currentView?.currentView ===
									'themejson_editor'
										? ' bg-[#404040]'
										: '' )
								}
								onClick={ () => {
									currentView?.set( 'themejson_editor' );
								} }
							>
								{ __( 'Styles and Settings', 'fse-studio' ) }
							</button>
						</li>
						<li>
							<button
								disabled={ ! currentTheme?.data }
								type="button"
								className={
									'focus:outline-none focus:ring-1 focus:ring-wp-blue' +
									( currentView?.currentView ===
									'theme_patterns'
										? ' bg-[#404040]'
										: '' )
								}
								onClick={ () => {
									currentView?.set( 'theme_patterns' );
								} }
							>
								{ __( 'Patterns', 'fse-studio' ) }
							</button>
						</li>
						<li>
							<button
								disabled={ ! currentTheme.data }
								type="button"
								className={
									'focus:outline-none focus:ring-1 focus:ring-wp-blue' +
									( currentView?.currentView ===
									'theme_templates'
										? ' bg-[#404040]'
										: '' )
								}
								onClick={ () => {
									currentView?.set( 'theme_templates' );

									maybePostWindowMessage(
										'fsestudio_click_templates'
									);
								} }
							>
								{ __( 'Templates', 'fse-studio' ) }
							</button>
						</li>
						<li>
							<button
								disabled={ ! currentTheme?.data }
								type="button"
								className={
									'focus:outline-none focus:ring-1 focus:ring-wp-blue' +
									( currentView?.currentView ===
									'template_parts'
										? ' bg-[#404040]'
										: '' )
								}
								onClick={ () => {
									currentView?.set( 'template_parts' );

									maybePostWindowMessage(
										'fsestudio_click_template_parts'
									);
								} }
							>
								{ __( 'Template Parts', 'fse-studio' ) }
							</button>
						</li>
					</>
				) : null }
			</ul>
		</nav>
	);
}
