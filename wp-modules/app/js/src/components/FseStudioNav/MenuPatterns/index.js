// @ts-check

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

// Context
import useStudioContext from '../../../hooks/useStudioContext';

export default function MenuPatterns() {
	const { currentTheme, currentView } = useStudioContext();

	return (
		<button
			disabled={
				currentTheme?.data && currentTheme.existsOnDisk ? false : true
			}
			type="button"
			className={
				'focus:outline-none focus:ring-1 focus:ring-wp-blue' +
				( currentView?.currentView === 'theme_patterns'
					? ' bg-[#404040]'
					: '' )
			}
			onClick={ () => {
				currentView?.set( 'theme_patterns' );
			} }
		>
			{ __( 'Patterns', 'fse-studio' ) }
		</button>
	);
}
