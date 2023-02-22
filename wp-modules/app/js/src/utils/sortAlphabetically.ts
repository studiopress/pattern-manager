/** Sorts an array of objects alphabetically by key. */
export default function sortAlphabetically< T extends unknown[] >(
	arr: T,
	key: string | number
) {
	// Sort the objects alphabetically by given key.
	arr.sort( ( a, b ) => {
		return a[ key ] > b[ key ] ? 1 : -1;
	} );

	return arr;
}
