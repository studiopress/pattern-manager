export default function changeWords( translation: string, text: string ) {
	if ( text === 'Publish' ) {
		return 'Create Pattern';
	}
	if ( text === 'Update' ) {
		return 'Update Pattern';
	}

	return translation;
}
