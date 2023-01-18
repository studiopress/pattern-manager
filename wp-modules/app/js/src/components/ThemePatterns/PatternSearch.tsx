// WP dependencies
import { SearchControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

// Types
import type { Pattern, Patterns } from '../../types';
import type { Dispatch, SetStateAction } from 'react';

type Props = {
	themePatterns: Patterns;
	setThemePatterns: Dispatch< SetStateAction< Patterns > >;
	keysToSearch?: Partial< keyof Pattern >[];
};

/** Component for searching the patterns by term, filtered by header/object key. */
export default function PatternSearch( {
	themePatterns,
	setThemePatterns,
	keysToSearch = [ 'title', 'keywords', 'description' ],
}: Props ) {
	const [ searchInput, setSearchInput ] = useState( '' );

	return (
		<SearchControl
			className="pattern-search"
			value={ searchInput }
			onChange={ ( searchTerm ) => {
				const matchedPatterns = Object.keys( themePatterns ).reduce(
					( acc, currentPattern ) => {
						const match = keysToSearch.some( ( key ) => {
							return themePatterns[ currentPattern ][ key ]
								?.toString()
								.toLowerCase()
								.includes(
									searchTerm.toString().toLowerCase()
								);
						} );

						return match
							? {
									...acc,
									[ currentPattern ]:
										themePatterns[ currentPattern ],
							  }
							: acc;
					},
					{}
				);

				setThemePatterns( matchedPatterns );
				setSearchInput( searchTerm );
			} }
		/>
	);
}
