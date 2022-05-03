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
export default function SiteEditor( { visible } ) {
	const { currentTheme, currentPatternId } = useStudioContext();

	return (
		<iframe
			title={ __( 'Pattern Editor', 'fse-studio' ) }
			
		
			style={ {
				width: '100%',
				height: 'calc(100vh - 80px)',
			} }
			src={ fsestudio.siteUrl + '/wp-admin/themes.php?page=gutenberg-edit-site&postType=wp_template' }
		/>
	);
}

export function BlockEditor() {
	const { currentPattern, currentPatternId, blockEditorLoaded, setBlockEditorLoaded } = useStudioContext();
	console.log( currentPattern );
	
	const [ currentPatternName, setCurrentPatternName ] = useState();

	useEffect( () => {
		// The iframed block editor will send a message to let us know when it is ready.
		window.addEventListener(
			'message',
			( event ) => {
				switch ( event.data ) {
					case 'fsestudio_pattern_editor_loaded':
						setBlockEditorLoaded( true );
				}
			},
			false
		);

		// As a fallback, if 5 seconds have passed, hide the spinner.
		setTimeout( () => {
			setBlockEditorLoaded( true );
		}, 5000 );
	}, [] );

	useEffect( () => {
		if ( currentPatternId.value !== currentPatternName ) {
			setBlockEditorLoaded( false );
		}
		setCurrentPatternName( currentPatternId.value );
	}, [ currentPatternId ] );

	return (
		<div className="fsestudio-pattern-editor">
			<div className="fsestudio-pattern-editor-body">
				<div className="fsestudio-pattern-editor-view">
					{ ! blockEditorLoaded ? (
						<div>
							<Spinner />
							{ createInterpolateElement(
							__(
								'Loading blocks for <span></span> into block editor...',
								'fse-studio'
							),
							{
								span: <span>{currentPattern?.title}</span>
							}
							)}
						</div>
					) : null }
					<iframe
						title={ __( 'Pattern Editor', 'fse-studio' ) }
					
						hidden={ ! blockEditorLoaded }
						style={ {
							width: '100%',
							height: 'calc( 100vh - 64px )',
						} }
						src={ fsestudio.siteUrl + '/wp-admin/post.php?post=' + currentPattern?.post_id + '&action=edit' }
					/>
				</div>
			</div>
		</div>
	);
}
