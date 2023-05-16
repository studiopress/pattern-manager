import type { Block, Pattern } from '../types';

export default function hasBlock(
	blockName: String,
	blocks: Block[],
	patternFileName: Pattern[ 'filename' ]
) {
	return blocks.some( ( block ) => {
		return (
			( block.name === blockName &&
				block.attributes?.slug === patternFileName ) ||
			hasBlock( blockName, block?.innerBlocks ?? [], patternFileName )
		);
	} );
}
