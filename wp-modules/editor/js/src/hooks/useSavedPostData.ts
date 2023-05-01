import { useSelect } from '@wordpress/data';
import { SelectQuery } from '../types';

type UseSavedPostData = {
	currentName: string;
};

export default function useSavedPostData(): UseSavedPostData {
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
