import { __ } from '@wordpress/i18n';

export default function changeWords( translation: string, text: string ) {
	if ( text === 'Publish' ) {
		return __( 'Save pattern to theme', 'pattern-manager' );
	}
	if ( text === 'Post published.' || text === 'Post updated.' ) {
		return __( 'Pattern saved to theme', 'pattern-manager' );
	}
	if ( text === 'Update' || text === 'Post updated.' ) {
		return __( 'Update Pattern', 'pattern-manager' );
	}
	if ( text === 'Add New Tag' ) {
		return __( 'Pattern Categories', 'pattern-manager' );
	}
	if ( text === 'Saved' ) {
		return __( 'Saved to your theme directory', 'pattern-manager' );
	}

	return translation;
}
