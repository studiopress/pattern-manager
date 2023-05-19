import type { Block, Pattern } from '../types';

export default function hasBlock(
	blockName: String,
	blocks: Block[],
	patternName: Pattern[ 'name' ]
) {
	return blocks.some( ( block ) => {
		return (
			( block.name === blockName &&
				block.attributes?.slug === patternName ) ||
			hasBlock( blockName, block?.innerBlocks ?? [], patternName )
		);
	} );
}
