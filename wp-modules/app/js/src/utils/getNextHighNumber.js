import { getNestedValue } from './nestedObjectUtility';

/**
 * Get the high number (plus 1) from an object.
 *
 * Iterate the object using the given field to extract a value.
 * Check the value against a regex to get the number and add to numArray.
 * Return the max value of numArray plus 1.
 *
 * @param {Object}       object
 * @param {Array|string} field
 * @param {RegExp}       regex
 * @return {number} The high number plus 1.
 */
export default function getNextHighNumber(
	object,
	field,
	regex = /[^0-9]+/g // Default strips everything but numbers.
) {
	if (
		! field ||
		object.length === 0 ||
		Object.keys( object ).length === 0
	) {
		return;
	}

	const numArray = Object.keys( object ).reduce( ( acc, key ) => {
		// If the field is an array, get the nested value from the object.
		// Otherwise, get the value from the current object level.
		const value = Array.isArray( field )
			? getNestedValue( object, [ key, ...field ] )
			: object[ key ][ field ];

		return value.match( regex )
			? acc.concat( value.replace( regex, '' ) || 0 )
			: acc;
	}, [] );

	return numArray && numArray.length > 0 ? Math.max( ...numArray ) + 1 : 1;
}
