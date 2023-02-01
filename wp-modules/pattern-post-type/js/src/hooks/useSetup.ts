import { useEffect } from '@wordpress/element';
import { dispatch, select } from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import { Pattern } from '../types';

export default function useSetup( pattern: Pattern ) {
	useEffect( () => {
		const { content, ...meta } = pattern;
		dispatch( 'core/editor' ).resetEditorBlocks(
			rawHandler( {
				HTML: content,
				mode: 'BLOCKS',
			} )
		);

		// Prevent this notice: "The backup of this post in your browser is different from the version below."
		// Get all notices, then remove if the notice has a matching wp autosave id.
		const notices = select( 'core/notices' ).getNotices();
		notices?.forEach( ( notice ) => {
			if ( notice.id.includes( 'wpEditorAutosaveRestore' ) ) {
				dispatch( 'core/notices' ).removeNotice( notice.id );
			}
		} );

		// TODO: Set the categories. They can found at: response.patternData.categories
		dispatch( 'core/editor' ).editPost( {
			meta: {
				...meta,
				previousName: pattern.name,
			},
		} );
	}, [] );
}
