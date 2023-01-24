/**
 * WP dependencies
 */
import { sprintf, _n } from '@wordpress/i18n';

type Props = {
	resultsLength: number;
	searchTerm: string;
};

export default function SearchCount( { resultsLength, searchTerm }: Props ) {
	return (
		<div className="pattern-search-count">
			<span>
				{ sprintf(
					/* translators: %1$d: the number of patterns found, %2$s: the search term for patterns */
					_n(
						'%1$d pattern found for %2$s',
						'%1$d patterns found for %2$s',
						resultsLength,
						'pattern-manager'
					),
					resultsLength,
					searchTerm
				) }
			</span>
		</div>
	);
}
