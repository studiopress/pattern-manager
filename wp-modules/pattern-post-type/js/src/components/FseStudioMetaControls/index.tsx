import { useSelect } from '@wordpress/data';
import { addFilter, removeFilter } from '@wordpress/hooks';
import PatternEditorSidebar from '../PatternEditorSidebar';
import useSubscription from '../../hooks/useSubscription';
import useChangeWords from '../../hooks/useChangeWords';

import { SelectQuery } from '../../types';

export default function FseStudioMetaControls() {
	const postMeta = useSelect( ( select: SelectQuery ) => {
		return select( 'core/editor' ).getEditedPostAttribute( 'meta' );
	}, [] );

	const currentPostType = useSelect( ( select: SelectQuery ) => {
		return select( 'core/editor' ).getCurrentPostType();
	}, [] );

	const { coreLastUpdate } = useSubscription();
	const { changeWords } = useChangeWords( postMeta );

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
