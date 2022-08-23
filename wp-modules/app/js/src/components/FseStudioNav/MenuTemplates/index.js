// @ts-check

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

// Context
import useStudioContext from '../../../hooks/useStudioContext';

export default function MenuTemplates() {
	const { currentTheme, currentView, templateEditorIframe } =
		useStudioContext();

	return (
		<button
			disabled={
				currentTheme?.data && currentTheme.existsOnDisk ? false : true
			}
			type="button"
			className={
				'focus:outline-none focus:ring-1 focus:ring-wp-blue' +
				( currentView?.currentView === 'theme_templates'
					? ' bg-[#404040]'
					: '' )
			}
			onClick={ () => {
				currentView?.set( 'theme_templates' );
				if ( templateEditorIframe?.current ) {
					templateEditorIframe.current.contentWindow.postMessage(
						JSON.stringify( {
							message: 'fsestudio_click_templates',
						} )
					);
				}
			} }
		>
			{ __( 'Templates', 'fse-studio' ) }
		</button>
	);
}
