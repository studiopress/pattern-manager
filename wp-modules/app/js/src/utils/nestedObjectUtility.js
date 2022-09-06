// @ts-check
/* eslint-disable jsdoc/check-param-names, jsdoc/require-param */

/**
 * Return a deeply nested value from an object.
 *
 * @param {Object} object
 * @param {Array}  keys
 * @return {*} The nested value.
 */
export function getNestedValue( object, keys ) {
	// Iterate over `keys`, passing the `currentKey` as the `accumulator` index on each iteration.
	return keys.reduce(
		( accumulator, currentKey ) =>
			accumulator ? accumulator[ currentKey ] : undefined,
		object // Initial value for the accumulator.
	);
}

/**
 * Update a deeply nested object value.
 *
 * The initial function accepts a value before recursively cloning the object upon secondary args
 * being passed immediately after. For example, the partial application could be called like this:
 *  - setNestedObject( value, defaultValue )( object, keys )
 *
 * @param {*}     value        A `value` of null means the child element should be deleted.
 * @param {*}     defaultValue Equality of `defaultValue` and `value` also specifies deletion.
 * @param {Array} keys         The array of object keys.
 * @return {Function} recursiveUpdate()
 */
export function setNestedObject( value, defaultValue, keys = [] ) {
	/**
	 * Recursively clone an object and update a nested value.
	 *
	 * @param {Object} object The object to clone.
	 * @param {Array}  keys   The destructured keys.
	 * @return {Object} The new, updated object.
	 */
	return function recursiveUpdate(
		object,
		[ currentKey, ...theRestOfTheKeys ] = keys,
		index = 0
	) {
		// Create a new object to avoid mutating the original.
		// Check if the current level is an array or object, then spread accordingly.
		const newObject = Array.isArray( object )
			? [ ...object ]
			: { ...object };

		// If `value` is null or equal to `defaultValue`, we need to delete the element.
		const shouldDeleteValue =
			null === value ||
			( defaultValue !== null && defaultValue === value );

		// Delete the target value if flagged by `shouldDeleteValue`.
		// `! theRestOfTheKeys.length` means we are at the end of the keys.
		if ( ! theRestOfTheKeys.length && shouldDeleteValue ) {
			delete newObject[ currentKey ];
		}

		// If there are keys left in `theRestOfTheKeys`, clone the next level of the object.
		if ( theRestOfTheKeys.length ) {
			// Recursively clone the next object level.
			newObject[ currentKey ] = recursiveUpdate(
				// Make sure `currentKey` exists prior to attempting to update a value within it.
				// Validate shape by using key from the next index level.
				_validateObjectLevel( object[ currentKey ], keys[ index + 1 ] ),
				theRestOfTheKeys,
				index + 1
			);
		} else if ( ! shouldDeleteValue ) {
			// If there are no keys left, we've reached the target level!
			// Store the result on the `currentKey`.
			newObject[ currentKey ] = value;
		}

		// Filter out empty elements from parent arrays of deleted children.
		// Return the filtered array.
		if ( shouldDeleteValue && Array.isArray( newObject ) ) {
			return newObject.filter( Boolean );
		}

		return newObject;
	};
}

/**
 * Validate the object level by checking that it is defined and not empty.
 *
 * If the level is empty and the key evaluates to a number, return an empty array.
 * If the level is empty and the key evaluates to a string (NaN), return an empty object.
 *
 * Otherwise, return the unaffected object.
 *
 * @param {Object|Array}  object
 * @param {string|number} key
 * @return {Object|Array} An empty object/array, or the unaffected object.
 */
export function _validateObjectLevel( object, key ) {
	if (
		! object ||
		object.length === 0 ||
		Object.keys( object ).length === 0
	) {
		return isNaN( Number( key ) ) ? {} : [];
	}

	return object;
}
