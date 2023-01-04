import PatternEditorSidebar from '../PatternEditorSidebar';
import usePostData from '../../hooks/usePostData';
import useSubscription from '../../hooks/useSubscription';
import useFilters from '../../hooks/useFilters';

export default function FseStudioMetaControls() {
	const { coreLastUpdate, postMeta, currentPostType, postDirty } =
		usePostData();
	useSubscription( currentPostType, postDirty );
	useFilters( postMeta );

	// Will only render component for post type 'fsestudio_pattern'.
	return currentPostType === 'fsestudio_pattern' ? (
		<PatternEditorSidebar
			coreLastUpdate={ coreLastUpdate }
			postMeta={ postMeta }
		/>
	) : null;
}
