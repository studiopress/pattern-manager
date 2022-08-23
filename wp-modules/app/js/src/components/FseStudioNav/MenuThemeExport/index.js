// @ts-check

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

// Context
import useStudioContext from '../../../hooks/useStudioContext';

export default function MenuThemeExport() {
	const { currentTheme } = useStudioContext();

	return (
		<button
			className="flex items-center gap-4"
			type="button"
			onClick={ () => {
				currentTheme?.export();
			} }
		>
			<svg
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
	);
}
