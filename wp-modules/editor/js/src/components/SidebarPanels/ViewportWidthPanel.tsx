import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { RangeControl } from '@wordpress/components';

import type { BaseSidebarProps } from './types';
import type { Pattern } from '../../types';

export default function ViewportWidthPanel( {
	postMeta,
	handleChange,
}: BaseSidebarProps ) {
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
				initialPosition={ 1280 } // Used if there is no value.
				value={ postMeta.viewportWidth }
				onChange={ ( value: Pattern[ 'viewportWidth' ] ) =>
					handleChange( 'viewportWidth', value )
				}
			/>
		</PluginDocumentSettingPanel>
	);
}
