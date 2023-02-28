import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { PostMeta, SelectQuery } from '../types';

type UseEditedPostData = {
	postMeta: PostMeta;
	title: string;
};

export default function useEditedPostData(): UseEditedPostData {
	// @ts-expect-error the @wordpress/editor store isn't typed.
	return {
		...useSelect(
			( select: SelectQuery ) => ( {
				postMeta:
					select( editorStore ).getEditedPostAttribute( 'meta' ),
				title: select( editorStore ).getEditedPostAttribute( 'title' ),
			} ),
			[]
		),
	};
}
