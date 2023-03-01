import { useSelect } from '@wordpress/data';
import { PostMeta, SelectQuery } from '../types';

type UseEditedPostData = {
	postMeta: PostMeta;
	title: string;
};

export default function useEditedPostData(): UseEditedPostData {
	// @ts-expect-error if @wordpress/editor store is typed, pass it to select() instead of the string.
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
