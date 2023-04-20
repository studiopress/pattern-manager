import type { Block, Pattern } from '../types';

export default function hasPmPatternBlock(
	blocks: Block[],
	patternName: Pattern[ 'name' ]
) {
	return blocks.some( ( block ) => {
		return (
			( block.name === 'core/pattern' &&
				block.attributes?.slug === patternName ) ||
			hasPmPatternBlock( block?.innerBlocks ?? [], patternName )
		);
	} );
}
