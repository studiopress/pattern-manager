// WP dependencies
import { SearchControl } from '@wordpress/components';

// Types
type Props = {
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
