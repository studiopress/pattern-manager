// @ts-check

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

// Context
import useStudioContext from '../../../hooks/useStudioContext';

export default function MenuStylesSettings() {
	const { currentTheme, currentView } = useStudioContext();

	return (
		<button
			disabled={
				currentTheme?.data && currentTheme.existsOnDisk ? false : true
			}
			type="button"
			className={
				'focus:outline-none focus:ring-1 focus:ring-wp-blue' +
				( currentView?.currentView === 'themejson_editor'
					? ' bg-[#404040]'
					: '' )
			}
			onClick={ () => {
				currentView?.set( 'themejson_editor' );
			} }
		>
			{ __( 'Styles and Settings', 'fse-studio' ) }
		</button>
	);
}
