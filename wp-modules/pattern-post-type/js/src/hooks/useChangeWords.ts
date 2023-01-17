import { PostMeta } from '../types';

export default function useChangeWords( postMeta: PostMeta ) {
	// Change the word "Publish" to "Save Pattern"
	function changeWords( translation: string, text: string ) {
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

		return translation;
	}

	return {
		changeWords,
	};
}
