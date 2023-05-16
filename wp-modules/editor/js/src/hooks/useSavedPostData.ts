import { useSelect } from '@wordpress/data';
import { SelectQuery } from '../types';

type UseSavedPostData = {
	currentFileName: string;
};

export default function useSavedPostData(): UseSavedPostData {
	return {
		...useSelect(
			( select: SelectQuery ) => ( {
				currentFileName:
					select( 'core/editor' ).getCurrentPostAttribute( 'meta' )
						?.name,
			} ),
			[]
		),
	};
}
