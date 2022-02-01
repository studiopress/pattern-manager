/**
 * Function which checks if a block contains an attribute which contains the string ".local".
 */

const { __ } = wp.i18n;

export function localUrlsForbidden( block ) {
	console.log(
		__( 'Testing for local URLs in ', 'genesisstudio' ) + block.name
	);

	for ( const attribute in block.attributes ) {
		// If this block has the textColor attribute, which is used when a theme color pallete option has been picked, return an error.
		if (
			typeof block.attributes[ attribute ] === 'string' &&
			block.attributes[ attribute ].includes( '.local' )
		) {
			return {
				success: false,
				errorCode: 'local_urls_forbidden',
				errorTitle: __( 'Local URL found', 'genesisstudio' ),
				errorMessage: __(
					'You cannot include locally hosted content. Offload your content to a publicly accessible server.',
					'genesisstudio'
				),
				invalidValue: block.attributes[ attribute ],
				block,
			};
		}
	}

	// This error check needs to be recursive, so check all innerblocks as well.
	if ( block.innerBlocks ) {
		for ( const innerBlock in block.innerBlocks ) {
			const testResult = localUrlsForbidden(
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
