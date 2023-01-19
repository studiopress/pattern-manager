// WP dependencies
import { SearchControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

// Types
import type { Pattern, Patterns } from '../../types';
import type { MutableRefObject, Dispatch, SetStateAction } from 'react';

type Props = {
	patternsRefCurrent: MutableRefObject< Patterns >[ 'current' ];
	searchTerm: string;
	setSearchTerm: ( newSearchTerm: string ) => void;
};

/** Component for searching the patterns by term, filtered by header/object key. */
export default function PatternSearch( { searchTerm, setSearchTerm }: Props ) {
	return (
		<SearchControl
			className="pattern-search"
			value={ searchTerm }
			onChange={ ( newSearchTerm: string ) => {
				setSearchTerm( newSearchTerm );
			} }
		/>
	);
}
