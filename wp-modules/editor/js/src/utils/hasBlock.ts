import type { Block, Pattern } from '../types';

export default function hasBlock(
	blockName: String,
	blocks: Block[],
	patternSlug: Pattern[ 'slug' ]
) {
	return blocks.some( ( block ) => {
		return (
			( block.name === blockName &&
				block.attributes?.slug === patternSlug ) ||
			hasBlock( blockName, block?.innerBlocks ?? [], patternSlug )
		);
	} );
}
