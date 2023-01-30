import PatternEditorSidebar from '../PatternEditorSidebar';
import usePostData from '../../hooks/usePostData';
import useSetup from '../../hooks/useSetup';
import useSaveButtonInterrupter from '../../hooks/useSaveButtonInterrupter';
import useFilters from '../../hooks/useFilters';

export default function PatternManagerMetaControls() {
	const { coreLastUpdate, postMeta, currentPostType } = usePostData();
	useSetup();
	useSaveButtonInterrupter();
	useFilters( postMeta );

	return (
		<PatternEditorSidebar
			coreLastUpdate={ coreLastUpdate }
			postMeta={ postMeta }
		/>
	);
}
