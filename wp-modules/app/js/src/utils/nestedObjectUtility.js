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

		// `! theRestOfTheKeys.length` means we are at the end of the keys.
		// If `value` is null or equal to `defaultValue`, we need to delete the element.
		const shouldDeleteValue =
			null === value ||
			( defaultValue !== null && defaultValue === value );

		if ( ! theRestOfTheKeys.length && shouldDeleteValue ) {
			delete newObject[ currentKey ];
		}

		// If there are keys left in `theRestOfTheKeys`, clone the next level of the object.
		if ( theRestOfTheKeys.length ) {
			// Make sure `currentKey` exists prior to attempting to update a value within it.
			if (
				! shouldDeleteValue &&
				( ! object[ currentKey ] || object[ currentKey ].length === 0 )
			) {
				// Mutate the next object level since it is undefined or empty.
				// Check if the next key evaluates to a number or string (NaN).
				// If it is a number, we need to create an empty array.
				// Otherwise, create an empty object.
				object[ currentKey ] = ! isNaN( Number( keys[ index + 1 ] ) )
					? []
					: {};
			}

			// Recursively clone the next object level.
			newObject[ currentKey ] = recursiveUpdate(
				object[ currentKey ],
				theRestOfTheKeys,
				index + 1
			);
		} else {
			// If there are no keys left, we've reached the target level!
			// Store the result on the `currentKey`.
			newObject[ currentKey ] = value;
		}

		if (
			// Filter out empty elements from parent arrays of deleted children.
			// If the `value` is null or equal to `defaultValue`, we need to clean up the parent.
			! theRestOfTheKeys.length &&
			shouldDeleteValue &&
			Array.isArray( newObject )
		) {
			return newObject.filter( Boolean );
		}

		return newObject;
	};
}
