import PatternEditorSidebar from '../PatternEditorSidebar';
import useSubscription from '../../hooks/useSubscription';
import useChangeWords from '../../hooks/useChangeWords';

export default function FseStudioMetaControls() {
	const postMeta = wp.data.useSelect( ( select ) => {
		return select( 'core/editor' ).getEditedPostAttribute( 'meta' );
	} );

	const { coreLastUpdate } = useSubscription();
	const { changeWords } = useChangeWords( postMeta );

	wp.hooks.addFilter( 'i18n.gettext', 'fse-studio/changeWords', changeWords );
	wp.hooks.removeFilter(
		'blockEditor.__unstableCanInsertBlockType',
		'removeTemplatePartsFromInserter'
	);

	if (
		'fsestudio_pattern' !==
		wp.data.select( 'core/editor' ).getCurrentPostType()
	) {
		return null; // Will only render component for post type 'fsestudio_pattern'
	}

	return (
		<PatternEditorSidebar
			coreLastUpdate={ coreLastUpdate }
			postMeta={ postMeta }
		/>
	);
}
