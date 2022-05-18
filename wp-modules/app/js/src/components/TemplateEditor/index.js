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
	const { templateEditorIframe, currentTheme } = useStudioContext();
	const [requestThemeRefresh, setRequestThemeRefresh] = useState(false);

	useEffect( () => {
		// When the site editor is saved, refresh the theme data.
		window.addEventListener(
			'message',
			( event ) => {
				switch ( event.data ) {
					case 'fsestudio_site_editor_save_complete':
						console.log( 'site saved' );
						setRequestThemeRefresh( true );
				}
			},
			false
		);

	}, [] );
	
	useEffect( () => {
		if ( requestThemeRefresh ) {
			setRequestThemeRefresh( false );
			// We have to do this outside the fsestudio_pattern_editor_save_complete listener because currentTheme is stale there.
			setTimeout( () => {
				currentTheme.get();
			}, 2000 );
		}
	}, [requestThemeRefresh] );

	if ( ! currentTheme?.existsOnDisk ) {
		return '';
	}

	return (
		<iframe
			title={ __( 'Pattern Editor', 'fse-studio' ) }
			
			ref={templateEditorIframe}
			style={ {
				width: '100%',
				height: 'calc(100vh - 80px)',
			} }
			src={ fsestudio.siteUrl + '/wp-admin/themes.php?page=gutenberg-edit-site&postType=wp_template&fsestudio_app=1' }
		/>
	);
}