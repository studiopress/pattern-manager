/**
 * Get the high number (plus 1) from an object.
 *
 * Iterate the object using the given field to extract a value.
 * Check the value against a regex to get the number and add to numArray.
 * Return the max value of numArray plus 1.
 *
 * @param {Object} object
 * @param {string} field
 * @param {RegExp} regex
 * @return {number} The high number plus 1.
 */
export default function getNextHighNumber(
	object,
	field,
	regex = /[^0-9]+/g // Default strips eveything but numbers.
) {
	if (
		! field ||
		object.length === 0 ||
		Object.keys( object ).length === 0
	) {
		return;
	}

	const numArray = Object.keys( object ).reduce( ( acc, key ) => {
		const value = object[ key ][ field ];

		return value.match( regex )
			? acc.concat( value.replace( regex, '' ) || 0 )
			: acc;
	}, [] );

	return numArray && numArray.length > 0 ? Math.max( ...numArray ) + 1 : 1;
}
