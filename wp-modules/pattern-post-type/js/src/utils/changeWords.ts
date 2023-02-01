import { __ } from '@wordpress/i18n';

export default function changeWords( translation: string, text: string ) {
	if ( text === __( 'Publish', 'pattern-manager' ) ) {
		return __( 'Save pattern to theme', 'pattern-manager' );
	}
	if ( text === __( 'Post published.', 'pattern-manager' ) || text === __( 'Post updated.', 'pattern-manager' ) ) {
		return __( 'Pattern saved to theme', 'pattern-manager' );
	}
	if ( text === __( 'Update', 'pattern-manager' ) || text === __( 'Post updated.', 'pattern-manager' ) ) {
		return __( 'Update Pattern', 'pattern-manager' );
	}
	if ( text === __( 'Add New Tag', 'pattern-manager' ) ) {
		return __( 'Pattern Categories', 'pattern-manager' );
	}
	if ( text === __( 'Saved', 'pattern-manager' ) ) {
		return __( 'Saved to your theme directory', 'pattern-manager' );
	}

	return translation;
}
