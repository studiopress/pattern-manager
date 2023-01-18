// WP dependencies
import { SearchControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

// Types
import type { Pattern, Patterns } from '../../types';
import type { MutableRefObject, Dispatch, SetStateAction } from 'react';

type Props = {
	patternsRefCurrent: MutableRefObject< Patterns >[ 'current' ];
	setThemePatterns: Dispatch< SetStateAction< Patterns > >;
	keysToSearch?: Partial< keyof Pattern >[];
};

/** Component for searching the patterns by term, filtered by header/object key. */
export default function PatternSearch( {
	patternsRefCurrent,
	setThemePatterns,
	keysToSearch = [ 'title', 'keywords', 'description' ],
}: Props ) {
	const [ searchInput, setSearchInput ] = useState( '' );

	return (
		<SearchControl
			className="pattern-search"
			value={ searchInput }
			onChange={ ( searchTerm ) => {
				const matchedPatterns = Object.keys(
					patternsRefCurrent
				).reduce( ( acc, currentPattern ) => {
					const match = keysToSearch.some( ( key ) => {
						return patternsRefCurrent[ currentPattern ][ key ]
							?.toString()
							.toLowerCase()
							.includes( searchTerm.toString().toLowerCase() );
					} );

					return match
						? {
								...acc,
								[ currentPattern ]:
									patternsRefCurrent[ currentPattern ],
						  }
						: acc;
				}, {} );

				setThemePatterns( matchedPatterns );
				setSearchInput( searchTerm );
			} }
		/>
	);
}
