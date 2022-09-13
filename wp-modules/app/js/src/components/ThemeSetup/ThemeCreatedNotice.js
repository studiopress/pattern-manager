/* eslint-disable react/no-unknown-property */

import { useEffect, useRef } from '@wordpress/element';
import { Icon, close } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import useStudioContext from '../../hooks/useStudioContext';
import useNoticeContext from '../../hooks/useNoticeContext';

export default function ThemeCreatedNotice() {
	const { currentView } = useStudioContext();
	const { setDisplayThemeCreatedNotice } = useNoticeContext();
	const buttonRef = useRef();

	useEffect( () => {
		buttonRef.current.focus();

		return () => {
			// If you navigate away from the menu item or tab that shows this notice,
			// this notice shouldn't show when you come back.
			setDisplayThemeCreatedNotice( false );
		};
	}, [] );

	// Explicitly dismiss the notice.
	const onDismiss = () => setDisplayThemeCreatedNotice( false );

	return (
		<div className="text-base flex flex-row mb-12 border border-[#008B24] rounded-md border-l-8 bg-[#EEF5EE]">
			<span className="text-[#008B24] self-center px-8 text-xl fill-current">
				<svg
					width="22"
					height="22"
					viewBox="0 0 22 22"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M15.2071 8.29289C15.5976 8.68342 15.5976 9.31658 15.2071 9.70711L10.7071 14.2071C10.3166 14.5976 9.68342 14.5976 9.29289 14.2071L6.79289 11.7071C6.40237 11.3166 6.40237 10.6834 6.79289 10.2929C7.18342 9.90237 7.81658 9.90237 8.20711 10.2929L10 12.0858L13.7929 8.29289C14.1834 7.90237 14.8166 7.90237 15.2071 8.29289Z"
						fill="#35872F"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2ZM0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11Z"
						fill="#35872F"
					/>
				</svg>
			</span>
			<span
				className="p-6 self-center bg-white rounded-r-md"
				role="dialog"
				aria-label={ __( 'Theme Saved', 'fse-studio' ) }
			>
				<p className="font-bold text-base mb-2">
					{ __( 'Theme successfully created!', 'fse-studio' ) }
				</p>
				<p className="text-base">
					{ __(
						'Your theme has been created, saved to your theme directory, and activated on this site! Continue customizing your theme by heading to Themes and Styles.',
						'fse-studio'
					) }
				</p>
				<button
					ref={ buttonRef }
					type="button"
					className="font-bold mt-2 inline-block hover:cursor-pointer hover:text-wp-black underline text-[#008B24]"
					onClick={ () => {
						currentView.set( 'themejson_editor' );
					} }
				>
					{ __( 'Go to Styles and Settings →', 'fse-studio' ) }
				</button>
			</span>
			<span className="flex flex-col rounded-r-md p-3 bg-white">
				<button
					className="bg-white"
					aria-label={ __(
						'Dismiss the theme created notice',
						'fse-studio'
					) }
					onClick={ onDismiss }
				>
					<Icon
						className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300 group-hover:opacity-100"
						icon={ close }
						size={ 30 }
					/>
				</button>
			</span>
		</div>
	);
}
