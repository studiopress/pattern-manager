export default function changeWords( translation: string, text: string ) {
	if ( text === 'Publish' ) {
		return 'Save pattern to theme';
	}
	if ( text === 'Post published.' ) {
		return 'Pattern saved to theme';
	}
	if ( text === 'Update' ) {
		return 'Update Pattern';
	}
	if ( text.includes( 'Post updated' ) ) {
		return 'Pattern Updated';
	}
	if ( text === 'Add New Tag' ) {
		return 'Pattern Categories';
	}
	if ( text === 'Saved' ) {
		return 'Saved to your theme directory';
	}

	return translation;
}
