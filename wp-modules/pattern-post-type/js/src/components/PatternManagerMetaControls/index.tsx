import { __ } from '@wordpress/i18n';
import { wordpress } from '@wordpress/icons';
import { Button, Fill, Icon } from '@wordpress/components';
import PatternEditorSidebar from '../PatternEditorSidebar';
import usePostData from '../../hooks/usePostData';
import useSubscription from '../../hooks/useSubscription';
import useSaveButtonInterrupter from '../../hooks/useSaveButtonInterrupter';
import useFilters from '../../hooks/useFilters';

export default function PatternManagerMetaControls() {
	const { coreLastUpdate, postMeta, currentPostType, postDirty } =
		usePostData();
	useSubscription( currentPostType, postDirty );
	useSaveButtonInterrupter();
	useFilters( postMeta );

	// Will only render component for post type 'pm_pattern'.
	return currentPostType === 'pm_pattern' ? (
		<>
			<PatternEditorSidebar
				coreLastUpdate={ coreLastUpdate }
				postMeta={ postMeta }
			/>
			<Fill name="__experimentalMainDashboardButton">
				<Button
					label={ __( 'Back to Patterns', 'pattern-manager' ) }
					showTooltip={ true }
					onClick={ () => {
						window.parent.postMessage( 'pm_back_to_patterns' );
					} }
				>
					<Icon size="36px" icon={ wordpress } />
				</Button>
			</Fill>
		</>
	) : null;
}
