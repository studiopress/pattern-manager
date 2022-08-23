// @ts-check

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

import { fsestudio } from '../../../globals';

export default function MenuExitFses() {
	return (
		<button
			className="flex items-center gap-4"
			type="button"
			onClick={ () => {
				window.location.href = fsestudio.adminUrl;
			} }
		>
			<svg
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
			{ __( 'Exit FSE Studio', 'fse-studio' ) }
		</button>
	);
}
