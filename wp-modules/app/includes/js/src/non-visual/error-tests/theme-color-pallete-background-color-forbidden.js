/**
 * Function which checks if a block contains a background color or not.
 */

const { __ } = wp.i18n;

export function themeColorPalleteBackgroundColorForbidden( block ) {
	/* eslint-disable */
	console.log(
		__( 'Testing No non-themeJson colors for ', 'fse-studio' ) +
			block.name,
		block
	);
	/* eslint-enable */

	for ( const attribute in block.attributes ) {
		// If this block has the backgroundColor attribute, which is used when a theme color pallete option has been picked, return an error.
		if ( attribute === 'style' ) {
			if (
				block.attributes[ attribute ]?.color?.background?.startsWith(
					'#'
				)
			) {
				return {
					success: false,
					errorCode:
						'theme_color_pallete_background_color_not_allowed',
					errorTitle: __( 'Invalid Background Color', 'fse-studio' ),
					errorMessage: __(
						'You cannot use a color provided by your theme, as the theme could change and the color suddenly be unavailable.',
						'fse-studio'
					),
					invalidValue: block.attributes[ attribute ],
					block,
				};
			}
		}
	}

	// This error check needs to be recursive, so check all innerblocks as well.
	if ( block.innerBlocks ) {
		for ( const innerBlock in block.innerBlocks ) {
			const testResult = themeColorPalleteBackgroundColorForbidden(
				block.innerBlocks[ innerBlock ]
			);
			if ( ! testResult.success ) {
				return testResult;
			}
		}
	}

	// If this block did not have the customBackgroundColor attribute, return an error.
	return {
		success: true,
	};
}
