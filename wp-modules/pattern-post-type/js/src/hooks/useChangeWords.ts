export default function useChangeWords( postMeta ) {
	// Change the word "Publish" to "Save Pattern"
	function changeWords( translation, text ) {
		if ( postMeta?.type === 'pattern' ) {
			if ( text === 'Publish' ) {
				return 'Save pattern to theme';
			}
			if ( text === 'Post published.' || text === 'Post updated.' ) {
				return 'Pattern saved to theme';
			}
			if ( text === 'Update' || text === 'Post updated.' ) {
				return 'Update Pattern';
			}
			if ( text === 'Add New Tag' ) {
				return 'Pattern Categories';
			}
			if ( text === 'Saved' ) {
				return 'Saved to your theme directory';
			}
		}

		if ( postMeta?.type === 'template' ) {
			if ( text === 'Pattern' ) {
				return 'Template';
			}
			if ( text === 'Publish' ) {
				return 'Save template to theme';
			}
			if ( text === 'Post published.' || text === 'Post updated.' ) {
				return 'Template saved to theme';
			}
			if ( text === 'Update' || text === 'Post updated.' ) {
				return 'Update Template';
			}
			if ( text === 'Add New Tag' ) {
				return 'Pattern Categories';
			}
			if ( text === 'Saved' ) {
				return 'Saved to your theme directory';
			}
		}

		return translation;
	}

	return {
		changeWords,
	};
}
