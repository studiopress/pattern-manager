import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { PostMeta, SelectQuery } from '../types';

type UsePostData = {
	postMeta: PostMeta;
	title: string;
};

export default function usePostData(): UsePostData {
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
