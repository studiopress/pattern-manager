/** Return react-select formatted options from an array of selections. */
export default function getSelectedOptions<
	T extends {
		label: string;
		value: string;
	}
>( selections: string[], availableOptions: T[], optionKey: keyof T ) {
	return selections.reduce(
		( acc: T[], selection ) =>
			// Add only if value is not found in the accumulator.
			! acc.find(
				( option ) => option && option[ optionKey ] === selection
			)
				? [
						...acc,
						availableOptions.find(
							( matchedSelection ) =>
								matchedSelection[ optionKey ] === selection
						),
				  ]
				: acc,
		[]
	);
}
