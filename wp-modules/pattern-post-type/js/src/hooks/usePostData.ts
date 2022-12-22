import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { SelectQuery } from '../types';

export default function usePostData() {
	const [ coreLastUpdate, setCoreLastUpdate ] = useState( '' );

	const { postMeta, currentPostType, postContent, postDirty } = useSelect(
		( select: SelectQuery ) => ( {
			postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
			currentPostType: select( 'core/editor' ).getCurrentPostType(),
			postContent: select( 'core/editor' ).getEditedPostContent(),
			postDirty: select( 'core/editor' ).isEditedPostDirty(),
		} ),
		[]
	);

	useEffect( () => {
		setCoreLastUpdate( Date.now().toString() );
	}, [] );

	return {
		coreLastUpdate,
		postMeta,
		currentPostType,
		postContent,
		postDirty,
	};
}
