/**
 * Function which checks if a block contains a background color or not.
 */

const { __ } = wp.i18n;

export function invalidFontSize(block) {
	/* eslint-disable */
	console.log(
		__( 'Testing Invaid Font Size for ', 'genesisstudio' ) + block.name,
		block
	);
	/* eslint-enable */

	for (const attribute in block.attributes) {
		// If this block has the fontSize attribute, make sure it's not one of the forbidden values.
		if (attribute === 'style') {
			if (
				block.attributes[attribute]?.typography?.fontSize === 'small' ||
				block.attributes[attribute]?.typography?.fontSize ===
					'medium' ||
				block.attributes[attribute]?.typography?.fontSize ===
					'normal' ||
				block.attributes[attribute]?.typography?.fontSize === 'large' ||
				block.attributes[attribute]?.typography?.fontSize === 'huge'
			) {
				continue;
			} else {
				return {
					success: false,
					errorCode: 'invalid_font_size',
					errorTitle: __('Invaid Font Size', 'genesisstudio'),
					errorMessage: __(
						'You cannot use a font size not provided by your theme.',
						'genesisstudio'
					),
					invalidValue:
						block.attributes[attribute]?.typography?.fontSize,
					block,
				};
			}
		}
	}

	// This error check needs to be recursive, so check all innerblocks as well.
	if (block.innerBlocks) {
		for (const innerBlock in block.innerBlocks) {
			const testResult = invalidFontSize(block.innerBlocks[innerBlock]);
			if (!testResult.success) {
				return testResult;
			}
		}
	}

	// If this block did not have the customBackgroundColor attribute, return an error.
	return {
		success: true,
	};
}
