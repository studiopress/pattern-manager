// @ts-check

// WP, general dependencies
import { __ } from '@wordpress/i18n';
import React from 'react';

// Context
import useStudioContext from '../../../hooks/useStudioContext';

export default function MenuTemplateParts() {
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
				( currentView?.currentView === 'template_parts'
					? ' bg-[#404040]'
					: '' )
			}
			onClick={ () => {
				currentView?.set( 'template_parts' );
				if ( templateEditorIframe?.current ) {
					templateEditorIframe.current.contentWindow.postMessage(
						JSON.stringify( {
							message: 'fsestudio_click_template_parts',
						} )
					);
				}
			} }
		>
			{ __( 'Template Parts', 'fse-studio' ) }
		</button>
	);
}
