/**
 * Function which checks if a heading block has a color set.
 */

const { __ } = wp.i18n;

export function headingColorRequired(block) {
	/* eslint-disable */
	console.log(
		__( 'Testing Heading Color Required for ', 'genesisstudio' ) +
			block.name
	);
	/* eslint-enable */

	const defaultResponse = {
		success: false,
		errorCode: 'heading_color_not_found',
		errorTitle: __('Heading Color Required', 'genesisstudio'),
		errorMessage: __(
			'All heading blocks must have a color set.',
			'genesisstudio'
		),
		block,
	};

	// Only the core/heading block requires a color.
	if (block.name === 'core/heading') {
		if (
			!block.attributes.style ||
			!block.attributes.style.color ||
			!block.attributes.style.color.text
		) {
			return defaultResponse;
		}
	}

	// This error check needs to be recursive, so check all innerblocks as well.
	if (block.innerBlocks) {
		for (const innerBlock in block.innerBlocks) {
			const testResult = headingColorRequired(
				block.innerBlocks[innerBlock]
			);
			if (!testResult.success) {
				return testResult;
			}
		}
	}

	return {
		success: true,
	};
}
