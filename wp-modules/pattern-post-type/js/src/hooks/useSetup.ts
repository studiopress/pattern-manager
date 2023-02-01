import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import type { Pattern, SelectQuery } from '../types';

export default function useSetup( pattern: Pattern ) {
	const { removeNotice } = useDispatch( 'core/notices' );
	const { editPost, resetEditorBlocks } = useDispatch( 'core/editor' );
	const notices = useSelect( ( select: SelectQuery ) => {
		return select( 'core/notices' ).getNotices();
	}, [] );

	useEffect( () => {
		const { content, ...meta } = pattern;
		resetEditorBlocks(
			rawHandler( {
				HTML: content,
				mode: 'BLOCKS',
			} )
		);

		// Prevent this notice: "The backup of this post in your browser is different from the version below."
		// Get all notices, then remove if the notice has a matching wp autosave id.

		notices?.forEach( ( notice ) => {
			if ( notice.id.includes( 'wpEditorAutosaveRestore' ) ) {
				removeNotice( notice.id );
			}
		} );

		// TODO: Set the categories. They can found at: response.patternData.categories
		editPost( {
			meta: {
				...meta,
				previousName: pattern.name,
			},
		} );
	}, [] );
}
