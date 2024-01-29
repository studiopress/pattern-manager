/** Check if two flat arrays are loosely equal. */
export default function flatUnorderedEquals<
	T extends string | number | boolean,
>( arrayA: T[], arrayB: T[] ) {
	arrayA.sort();
	arrayB.sort();

	return (
		arrayA.length === arrayB.length &&
		arrayA.every( ( value, index ) => {
			return value === arrayB[ index ];
		} )
	);
}
