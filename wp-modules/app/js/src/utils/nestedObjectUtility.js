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
	return keys.reduce(
		( acc, key ) => ( acc ? acc[ key ] : undefined ),
		object
	);
}

/**
 * Update a deeply nested object value.
 *
 * The initial function accepts a value before recursively cloning the
 * object upon secondary arguments being passed immediately after.
 *
 * For example, the partial application could be called like this:
 *  - setNestedObject( value, defaultValue )( object, keys )
 *
 * @param {*} value
 * @param {*} defaultValue
 * @return {Function} recursiveUpdate()
 */
export function setNestedObject( value, defaultValue ) {
	/**
	 * Recursively clone an object and update a nested value.
	 *
	 * @param {Object} object
	 * @param {Array}  keys
	 * @return {Object} The new, updated object.
	 */
	return function recursiveUpdate(
		object,
		[ firstKey, ...theRestOfTheKeys ] = []
	) {
		const newObject = Array.isArray( object )
			? [ ...object ]
			: { ...object };

		if (
			// This means we are at the end of the keys.
			! theRestOfTheKeys.length &&
			( null === value ||
				( defaultValue !== null && defaultValue === value ) )
		) {
			// Delete the element.
			delete newObject[ firstKey ];
		} else {
			// Recurse if there are more keys, otherwise update the element.
			newObject[ firstKey ] = theRestOfTheKeys.length
				? recursiveUpdate( object[ firstKey ], theRestOfTheKeys )
				: value;
		}

		// Filter out deleted elements from parent arrays.
		return Array.isArray( newObject ) &&
			( null === value ||
				( defaultValue !== null && defaultValue === value ) )
			? newObject.filter( Boolean )
			: newObject;
	};
}
