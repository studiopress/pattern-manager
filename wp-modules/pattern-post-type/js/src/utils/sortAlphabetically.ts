/**
 * Sort an array of objects alphabetically by key.
 * Optionally, include a key and string to place items on top of the sorted array.
 *
 * @param {Array}  arr       The array for sorting.
 * @param {string} key       The key to use for sorting.
 * @param {string} topKey    The extra key to check for pushing items to the top.
 * @param {string} topString The extra string to match for pushing items to the top.
 * @return {Array}           The sorted array.
 */
export default function sortAlphabetically(
	arr: string[],
	key: string,
	topKey = '',
	topString = ''
) {
	// Sort the objects alphabetically by given key.
	arr.sort( ( a, b ) => {
		return a[ key ] > b[ key ] ? 1 : -1;
	} );

	// Check the extra key and string for pushing items to top.
	if ( topKey && topString ) {
		arr.sort( ( a ) => {
			return a[ topKey ] === topString ? -1 : 0;
		} );
	}

	return arr;
}
