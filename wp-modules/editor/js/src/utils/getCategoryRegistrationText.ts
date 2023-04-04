export default function getCategoryRegistrationText(
	categoryOptions: {
		label: string;
		value: string;
	}[]
) {
	const formattedCategoriesToCopy = categoryOptions.reduce(
		( acc, category ) =>
			`register_block_pattern_category( '${
				category.value
			}', array( 'label' => '${ category.label }' ) );${
				acc.length ? '\n\t' + acc : ''
			}`,
		''
	);

	const textToCopy = `add_action( 'init', function () {
	${ formattedCategoriesToCopy }
} );`;

	return textToCopy;
}
