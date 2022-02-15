/**
 * Function which checks if a block contains a background color or not.
 */

const { __ } = wp.i18n;

export function backgroundColorRequired(block) {
	/* eslint-disable */
	console.log(
		__( 'Testing Background Color Required for ', 'genesisstudio' ) +
			block.name
	);
	/* eslint-enable */

	// Only the genesis-blocks/gb-columns block requires a background color.
	if (block.name !== 'genesis-blocks/gb-columns') {
		return {
			success: true,
		};
	}

	for (const attribute in block.attributes) {
		// If this block has the customBackgroundColor attribute, return success.
		if (attribute === 'customBackgroundColor') {
			return {
				success: true,
			};
		}
	}

	// If this block did not have the customBackgroundColor attribute, return an error.
	return {
		success: false,
		errorCode: 'background_color_not_found',
		errorTitle: __('Background Color Required', 'genesisstudio'),
		errorMessage: __(
			'All top-level blocks must have a background color applied.',
			'genesisstudio'
		),
		block,
	};
}
