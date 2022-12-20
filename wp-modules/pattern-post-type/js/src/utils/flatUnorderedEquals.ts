/**
 * Check that two indexed arrays have the same elements.
 * Elements do not need to be in order as both arrays will be sorted.
 *
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @return {boolean} True if the arrays are loosely equal.
 */
export default function flatUnorderedEquals( arrayA, arrayB ) {
	arrayA.sort();
	arrayB.sort();

	return (
		arrayA.length === arrayB.length &&
		arrayA.every( ( value, index ) => {
			return value === arrayB[ index ];
		} )
	);
}
