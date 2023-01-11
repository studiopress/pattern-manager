/**
 * Entire file forked from Gutenberg: https://github.com/WordPress/gutenberg/blob/8029f73ff0d4066a5d3fd72fb5a7cff9b6a05b7e/packages/block-editor/src/components/inserter/index.js
 */

/**
 * External dependencies
 */
import { deburr, differenceWith, words } from 'lodash';

type Item = {
	type?: string;
	name?: string;
	title: string;
	description?: string;
	keywords?: string[];
	category?: string;
	collection?: unknown[];
};

type Config = {
	getType?: () => Item[ 'type' ];
	getName?: () => Item[ 'name' ];
	getTitle?: () => Item[ 'title' ];
	getDescription?: () => Item[ 'description' ];
	getKeywords?: () => Item[ 'keywords' ];
	getCategory?: () => Item[ 'category' ];
	getCollection?: () => Item[ 'collection' ];
};

// Sanitizes the search input string.
function normalizeSearchInput( input = '' ) {
	// Disregard diacritics.
	//  Input: "média"
	input = deburr( input );

	// Accommodate leading slash, matching autocomplete expectations.
	//  Input: "/media"
	input = input.replace( /^\//, '' );

	// Lowercase.
	//  Input: "MEDIA"
	input = input.toLowerCase();

	return input;
}

// Converts the search term into a list of normalized terms.
function getNormalizedSearchTerms( input = '' ) {
	// Extract words.
	return words( normalizeSearchInput( input ) );
}

function removeMatchingTerms(
	unmatchedTerms: string[],
	unprocessedTerms: string
) {
	return differenceWith(
		unmatchedTerms,
		getNormalizedSearchTerms( unprocessedTerms ),
		( unmatchedTerm, unprocessedTerm ) =>
			unprocessedTerm.includes( unmatchedTerm )
	);
}

/**
 * Filters an item list given a search term.
 *
 * @param  items       Item list
 * @param  searchInput Search input.
 * @param  config      Search Config.
 * @return             Filtered item list.
 */
export default function searchItems(
	items: Item[] = [],
	searchInput = '',
	config: Config = {}
) {
	const normalizedSearchTerms = getNormalizedSearchTerms( searchInput );
	if ( normalizedSearchTerms.length === 0 ) {
		return items;
	}

	const rankedItems = items
		.map( ( item ) => {
			return [ item, getItemSearchRank( item, searchInput, config ) ];
		} )
		.filter( ( [ , rank ] ) => rank > 0 );

	rankedItems.sort(
		( [ , rank1 ]: number[], [ , rank2 ]: number[] ) => rank2 - rank1
	);

	return rankedItems.map( ( [ item ] ) => item );
}

/**
 * Get the search rank for a given item and a specific search term.
 * The better the match, the higher the rank.
 * If the rank equals 0, it should be excluded from the results.
 *
 * @param  item       Item to filter.
 * @param  searchTerm Search term.
 * @param  config     Search Config.
 * @return            Search Rank.
 */
function getItemSearchRank(
	item: Item,
	searchTerm: string,
	config: Config = {}
) {
	// Default search helpers
	const {
		getType = () => item.type || '',
		getName = () => item.name || '',
		getTitle = () => item.title,
		getDescription = () => item.description || '',
		getKeywords = () => item.keywords || [],
		getCategory = () => item.category,
		getCollection = (): null => null,
	} = config;

	const type = getType();
	const name = getName();
	const title = getTitle();
	const description = getDescription();
	const keywords = getKeywords();
	const category = getCategory();
	const collection = getCollection();

	const normalizedSearchInput = normalizeSearchInput( searchTerm );
	const normalizedTitle = normalizeSearchInput( title );

	let rank = 0;

	// Prefers exact matches
	// Then prefers if the beginning of the title matches the search term
	// name, keywords, categories, collection, variations match come later.
	if ( normalizedSearchInput === normalizedTitle ) {
		rank += 30;
	} else if ( normalizedTitle.startsWith( normalizedSearchInput ) ) {
		rank += 20;
	} else {
		const terms = [
			type,
			name,
			title,
			description,
			...keywords,
			category,
			collection,
		].join( ' ' );
		const normalizedSearchTerms = words( normalizedSearchInput );
		const unmatchedTerms = removeMatchingTerms(
			normalizedSearchTerms,
			terms
		);

		if ( unmatchedTerms.length === 0 ) {
			rank += 10;
		}
	}

	// Give a better rank to "core" namespaced items.
	if ( rank !== 0 && name.startsWith( 'core/' ) ) {
		rank++;
	}

	return rank;
}
