import { useEffect } from '@wordpress/element';
import { addFilter, removeFilter } from '@wordpress/hooks';
import { PostMeta } from '../types';
import useChangeWords from './useChangeWords';

export default function useFilters( postMeta: PostMeta ) {
	const { changeWords } = useChangeWords( postMeta );

	useEffect( () => {
		addFilter( 'i18n.gettext', 'pattern-manager/changeWords', changeWords );
		removeFilter(
			'blockEditor.__unstableCanInsertBlockType',
			'removeTemplatePartsFromInserter'
		);
	}, [] );
}
