import { v4 as uuidv4 } from 'uuid';

// WP Dependencies

// @ts-check
import { __ } from '@wordpress/i18n';
import { Modal, Spinner } from '@wordpress/components';
import { useState, useEffect, useRef, createInterpolateElement } from '@wordpress/element';

// Hooks
import useStudioContext from '../../hooks/useStudioContext';

// Components
import PatternPicker from '../PatternPicker';

// Utils
import searchItems from '../../utils/searchItems';

/** @param {{visible: boolean}} props */
export default function TemplateEditor( { visible } ) {
	const { siteEditorIframe, currentTheme } = useStudioContext();
	console.log( currentTheme?.existsOnDisk );
	
	if ( ! currentTheme?.existsOnDisk ) {
		return '';
	}

	return (
		<iframe
			title={ __( 'Pattern Editor', 'fse-studio' ) }
			
			ref={siteEditorIframe}
			style={ {
				width: '100%',
				height: 'calc(100vh - 80px)',
			} }
			src={ fsestudio.siteUrl + '/wp-admin/themes.php?page=gutenberg-edit-site&postType=wp_template' }
		/>
	);
}