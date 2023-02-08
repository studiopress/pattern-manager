import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import type { InitialPatternManager, SelectQuery } from '../types';

export default function useSetup(
	pattern: InitialPatternManager[ 'pattern' ]
) {
	const { removeNotice } = useDispatch( 'core/notices' );
	const { editPost } = useDispatch( 'core/editor' );
	const notices = useSelect( ( select: SelectQuery ) => {
		return select( 'core/notices' ).getNotices();
	}, [] );

	useEffect( () => {
		const { content, ...meta } = pattern;

		editPost( {
			meta: {
				...meta,
				previousName: pattern.name,
			},
		} );
	}, [] );

	useEffect( () => {
		// Prevent this notice: "The backup of this post in your browser is different from the version below."
		// Get all notices, then remove if the notice has a matching wp autosave id.
		notices?.forEach( ( notice ) => {
			if ( notice.id.includes( 'wpEditorAutosaveRestore' ) ) {
				removeNotice( notice.id );
			}
		} );
	}, [ notices ] );
}
