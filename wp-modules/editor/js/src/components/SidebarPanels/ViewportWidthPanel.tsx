import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { RangeControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import PatternPreview from '../../../../../app/js/src/components/PatternPreview';
import { patternManager } from '../../globals';

import type { BaseSidebarProps, AdditionalSidebarProps } from './types';
import type { Pattern, SelectQuery } from '../../types';

export default function ViewportWidthPanel( {
	postMeta,
	handleChange,
	errorMessage,
}: BaseSidebarProps & Pick< AdditionalSidebarProps, 'errorMessage' > ) {
	const [ previewIsVisible, setPreviewIsVisible ] = useState( false );
	const savedPatternName = useSelect( ( select: SelectQuery ) => {
		return select( 'core/editor' ).getCurrentPostAttribute( 'meta' )?.name;
	}, [] );
	const viewportWidth = postMeta.viewportWidth || 1280;

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
				value={ viewportWidth }
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
							savedPatternName
						}
						viewportWidth={ viewportWidth }
					/>
				) ) }
		</PluginDocumentSettingPanel>
	);
}
