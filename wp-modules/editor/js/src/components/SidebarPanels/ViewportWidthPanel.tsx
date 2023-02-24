import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { RangeControl } from '@wordpress/components';
import PatternPreview from '../../../../../app/js/src/components/PatternPreview';
import { patternManager } from '../../globals';

import type { BaseSidebarProps } from './types';
import type { Pattern } from '../../types';

export default function ViewportWidthPanel( {
	postMeta,
	handleChange,
}: BaseSidebarProps ) {
	const viewportWidth = postMeta.viewportWidth || 1280;

	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-viewport-width"
			title={ __( 'Viewport Width', 'pattern-manager' ) }
		>
			<RangeControl
				aria-label={ __(
					'Viewport Width Adjustment Slider (used for resizing the preview for the pattern)',
					'pattern-manager'
				) }
				help={ __(
					'Adjust preview width for the pattern.',
					'pattern-manager'
				) }
				min={ 640 }
				max={ 2560 }
				step={ 80 }
				value={ viewportWidth }
				onChange={ ( value: Pattern[ 'viewportWidth' ] ) => {
					handleChange( 'viewportWidth', value );
				} }
			/>
			<PatternPreview
				url={
					patternManager.siteUrl +
					'?pm_pattern_preview=' +
					postMeta.name
				}
				viewportWidth={ viewportWidth }
			/>
		</PluginDocumentSettingPanel>
	);
}
