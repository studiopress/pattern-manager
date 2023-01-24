/**
 * WP dependencies
 */
import { __ } from '@wordpress/i18n';

type Props = {
	resultsLength: number;
	searchTerm: string;
};

export default function SearchCount( { resultsLength, searchTerm }: Props ) {
	const searchCountText =
		resultsLength === 1
			? `${ resultsLength } ${ __(
					'pattern found for',
					'pattern-manager'
			  ) } "${ searchTerm }"`
			: `${ resultsLength }  ${ __(
					'patterns found for',
					'pattern-manager'
			  ) } "${ searchTerm }"`;

	return (
		<div className="pattern-search-count">
			<span>{ searchCountText }</span>
		</div>
	);
}
