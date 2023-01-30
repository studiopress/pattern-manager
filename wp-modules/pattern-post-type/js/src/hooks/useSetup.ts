import { useEffect } from '@wordpress/element';
import { dispatch, select, useSelect } from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import { Pattern, Patterns, PostMeta, SelectQuery } from '../types';

export default function useSetup(
	patternName: Pattern[ 'name' ],
	pattern: Pattern,
	setPatterns: ( newPattern: Patterns ) => void,
	postContent: string,
	postMeta: PostMeta
) {
	useEffect( () => {
		setPatterns( {
			[ patternName ]: {
				content: postContent,
				...postMeta,
				slug: postMeta.name,
			},
		} );
	}, [ postContent, postMeta ] );

	useEffect( () => {
		// Insert the block string so the blocks show up in the editor itself.
		dispatch( 'core/editor' ).resetEditorBlocks(
			rawHandler( {
				HTML: pattern.content,
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

		// Get all of the pattern meta (and remove anything that is not specifically "pattern meta" here).
		const { content, ...patternMeta } = pattern;

		// Set the meta of the pattern
		dispatch( 'core/editor' ).editPost( {
			meta: patternMeta,
		} );
	}, [] );
}
