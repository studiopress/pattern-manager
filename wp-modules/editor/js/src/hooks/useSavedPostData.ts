import { useSelect } from '@wordpress/data';
import { SelectQuery } from '../types';

type useSavedPostData = {
	currentName: string;
};

export default function useSavedPostData(): useSavedPostData {
	return {
		...useSelect(
			( select: SelectQuery ) => ( {
				currentName:
					select( 'core/editor' ).getCurrentPostAttribute( 'meta' )
						?.name,
			} ),
			[]
		),
	};
}
