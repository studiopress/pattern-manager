import { useSelect } from '@wordpress/data';
import { addFilter, removeFilter } from '@wordpress/hooks';
import PatternEditorSidebar from '../PatternEditorSidebar';
import useSubscription from '../../hooks/useSubscription';
import useChangeWords from '../../hooks/useChangeWords';

import usePostData from '../../hooks/usePostData';

export default function FseStudioMetaControls() {
	const { coreLastUpdate, postMeta, currentPostType } = usePostData();

	const { changeWords } = useChangeWords( postMeta );

	useSubscription();

	addFilter( 'i18n.gettext', 'fse-studio/changeWords', changeWords );
	removeFilter(
		'blockEditor.__unstableCanInsertBlockType',
		'removeTemplatePartsFromInserter'
	);

	// Will only render component for post type 'fsestudio_pattern'.
	return currentPostType === 'fsestudio_pattern' ? (
		<PatternEditorSidebar
			coreLastUpdate={ coreLastUpdate }
			postMeta={ postMeta }
		/>
	) : null;
}
