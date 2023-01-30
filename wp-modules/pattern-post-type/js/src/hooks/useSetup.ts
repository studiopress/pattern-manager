import { useEffect } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import { patternManager } from '../globals';

export default function useSetup() {
	useEffect( () => {
		const pattern =
			patternManager.patterns?.[
				new URL( location.href ).searchParams.get( 'name' )
			];
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
