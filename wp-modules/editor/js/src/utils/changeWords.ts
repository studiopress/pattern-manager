export default function changeWords( translation: string, text: string ) {
	if ( text === 'Update' ) {
		return 'Update Pattern';
	}

	return translation;
}
