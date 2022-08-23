// @ts-check

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

// Context
import useStudioContext from '../../../hooks/useStudioContext';

// Utils
import createNewTheme from '../../../utils/createNewTheme';

export default function MenuCreateTheme() {
	const { themes, currentThemeId } = useStudioContext();

	return (
		<button
			className="flex items-center gap-4"
			type="button"
			onClick={ () => {
				createNewTheme( themes, currentThemeId );
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
					d="M10.207 9.38477C10.1562 9.43555 10.1562 9.48633 10.1562 9.53711V12.4062H1.21875V3.46875H7.33789C7.38867 3.46875 7.43945 3.46875 7.49023 3.41797L8.30273 2.60547C8.42969 2.47852 8.32812 2.25 8.15039 2.25H1.21875C0.533203 2.25 0 2.80859 0 3.46875V12.4062C0 13.0918 0.533203 13.625 1.21875 13.625H10.1562C10.8164 13.625 11.375 13.0918 11.375 12.4062V8.72461C11.375 8.54688 11.1465 8.44531 11.0195 8.57227L10.207 9.38477ZM14.168 4.28125C14.752 3.69727 14.752 2.75781 14.168 2.17383L13.0762 1.08203C12.4922 0.498047 11.5527 0.498047 10.9688 1.08203L4.31641 7.73438L4.0625 10.0449C3.98633 10.7051 4.54492 11.2637 5.20508 11.1875L7.51562 10.9336L14.168 4.28125ZM11.6797 5.04297L6.95703 9.76562L5.28125 9.96875L5.48438 8.29297L10.207 3.57031L11.6797 5.04297ZM13.3047 3.03711C13.4316 3.13867 13.4316 3.29102 13.3301 3.41797L12.543 4.20508L11.0703 2.70703L11.832 1.94531C11.9336 1.81836 12.1113 1.81836 12.2129 1.94531L13.3047 3.03711Z"
					fill="#969696"
				/>
			</svg>
			{ __( 'Create New Theme', 'fse-studio' ) }
		</button>
	);
}
