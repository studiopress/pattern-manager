import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { RangeControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import { PatternPreview } from 'patternmanager-common/components';
import { patternManager } from '../../globals';

import type { BaseSidebarProps, AdditionalSidebarProps } from './types';
import type { Pattern } from '../../types';

export default function ViewportWidthPanel( {
	currentName,
	errorMessage,
	viewportWidth,
	handleChange,
}: BaseSidebarProps< 'viewportWidth' > &
	AdditionalSidebarProps< 'errorMessage' | 'currentName' > ) {
	const [ previewIsVisible, setPreviewIsVisible ] = useState( false );
	const currentWidth = viewportWidth || 1280;

	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-viewport-width"
			title={ __( 'Viewport Width', 'pattern-manager' ) }
		>
			<RangeControl
				label={ __( 'Preview width in pixels', 'pattern-manager' ) }
				hideLabelFromVision={ true }
				help={ __(
					'Adjust the pattern preview width in the pattern inserter.',
					'pattern-manager'
				) }
				min={ 640 }
				max={ 2560 }
				step={ 80 }
				value={ currentWidth }
				onChange={ ( value: Pattern[ 'viewportWidth' ] ) => {
					handleChange( 'viewportWidth', value );
				} }
				onMouseMove={ () => setPreviewIsVisible( true ) }
				onMouseLeave={ () => setPreviewIsVisible( false ) }
			/>

			{ previewIsVisible &&
				( !! errorMessage ? (
					<RichText.Content
						tagName="span"
						className="components-panel__row-patternmanager-pattern-name-error-inner"
						value={ errorMessage }
					/>
				) : (
					<PatternPreview
						url={
							patternManager.siteUrl +
							'?pm_pattern_preview=' +
							currentName
						}
						viewportWidth={ currentWidth }
					/>
				) ) }
		</PluginDocumentSettingPanel>
	);
}
