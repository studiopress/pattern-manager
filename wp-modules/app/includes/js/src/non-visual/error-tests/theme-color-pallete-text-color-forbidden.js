/**
 * Function which checks if a block contains a forbidden Theme Color Pallete text color or not.
 */

const { __ } = wp.i18n;

export function themeColorPalleteTextColorForbidden( block ) {
	/* eslint-disable */
	console.log(
		__(
			'Testing Theme Color Pallete Text Color Forbidden for ',
			'fse-studio'
		) + block.name
	);
	/* eslint-enable */

	for ( const attribute in block.attributes ) {
		// If this block has the textColor attribute, which is used when a theme color pallete option has been picked, return an error.
		if ( attribute === 'textColor' ) {
			// The strings 'white' and 'black' are allowed because they are output by gutnberg's stylesheet lol.
			if (
				'white' === block.attributes[ attribute ] ||
				'black' === block.attributes[ attribute ] ||
				! block.attributes[ attribute ]
			) {
				continue;
			}

			return {
				success: false,
				errorCode: 'theme_color_pallete_text_color_not_allowed',
				errorTitle: __( 'Invalid Text Color', 'fse-studio' ),
				errorMessage: __(
					'You cannot use a text color provided by your theme, as the theme could change and the color suddenly be unavailable.',
					'fse-studio'
				),
				invalidValue: block.attributes[ attribute ],
				block,
			};
		}
	}

	// This error check needs to be recursive, so check all innerblocks as well.
	if ( block.innerBlocks ) {
		for ( const innerBlock in block.innerBlocks ) {
			const testResult = themeColorPalleteTextColorForbidden(
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
