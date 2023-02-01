import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import type { InitialPatternManager, SelectQuery } from '../types';

export default function useSetup(
	pattern: InitialPatternManager[ 'pattern' ]
) {
	const { createErrorNotice, removeNotice } = useDispatch( 'core/notices' );
	const { editPost, resetEditorBlocks } = useDispatch( 'core/editor' );
	const notices = useSelect( ( select: SelectQuery ) => {
		return select( 'core/notices' ).getNotices();
	}, [] );

	useEffect( () => {
		if ( ! pattern ) {
			createErrorNotice(
				__(
					'No patterns found. Is this the right URL?',
					'pattern-manager'
				)
			);
			return;
		}

		const { content, ...meta } = pattern;
		resetEditorBlocks(
			rawHandler( {
				HTML: content,
				mode: 'BLOCKS',
			} )
		);

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
