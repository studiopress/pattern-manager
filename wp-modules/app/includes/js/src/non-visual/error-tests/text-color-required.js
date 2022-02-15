/**
 * Function which checks if a block contains a text color or not.
 */

const { __ } = wp.i18n;

export function textColorRequired(block) {
	/* eslint-disable */
	console.log(
		__( 'Testing Text Color Required for ', 'genesisstudio' ) + block.name
	);
	/* eslint-enable */

	// Only the genesis-blocks/gb-columns block requires a text color.
	if (block.name !== 'genesis-blocks/gb-columns') {
		return {
			success: true,
		};
	}

	for (const attribute in block.attributes) {
		// If this block has the customBackgroundColor attribute, return success.
		if (attribute === 'customTextColor') {
			return {
				success: true,
			};
		}
	}

	// If this block did not have the customBackgroundColor attribute, return an error.
	return {
		success: false,
		errorCode: 'text_color_not_found',
		errorTitle: __('Text Color Required', 'genesisstudio'),
		errorMessage: __(
			'All top-level blocks must have a text color applied.',
			'genesisstudio'
		),
		block,
	};
}
