import { Fill } from '@wordpress/components';
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
				Here is something!!!
			</Fill>
		</>
	) : null;
}
