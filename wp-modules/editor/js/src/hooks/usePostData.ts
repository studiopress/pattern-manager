import { useSelect } from '@wordpress/data';
import { SelectQuery } from '../types';

export default function usePostData() {
	return {
		...useSelect(
			( select: SelectQuery ) => ( {
				postMeta:
					select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
				title: select( 'core/editor' ).getEditedPostAttribute(
					'title'
				),
			} ),
			[]
		),
	};
}
