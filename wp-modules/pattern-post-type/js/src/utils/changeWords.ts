import { __ } from '@wordpress/i18n';

export default function changeWords( translation: string, text: string ) {
	// Doesn't have a textdomain argument so that it will use the Core textdomain.
	// This filter should receive translations from Core, not this plugin.
	if ( text === __( 'Publish' ) ) {
		return __( 'Save pattern to theme', 'pattern-manager' );
	}
	if ( text === __( 'Post published.' ) || text === __( 'Post updated.' ) ) {
		return __( 'Pattern saved to theme', 'pattern-manager' );
	}
	if ( text === __( 'Update' ) || text === __( 'Post updated.' ) ) {
		return __( 'Update Pattern', 'pattern-manager' );
	}
	if ( text === __( 'Add New Tag' ) ) {
		return __( 'Pattern Categories', 'pattern-manager' );
	}
	if ( text === __( 'Saved' ) ) {
		return __( 'Saved to your theme directory', 'pattern-manager' );
	}

	return translation;
}
