export default function convertParsedBlocksToBlockTemplate(
	parsedBlocks,
	blockTemplate
) {
	for( const blockNum in parsedBlocks ) {
		const blockNamespace = parsedBlocks[blockNum]?.name;
		const blockAttributes = parsedBlocks[blockNum]?.attributes;
		let blockInnerBlocks = parsedBlocks[blockNum]?.innerBlocks;
		
		if ( blockInnerBlocks ) {
			
			blockInnerBlocks = convertParsedBlocksToBlockTemplate( blockInnerBlocks, [] );
			
		}
		blockTemplate.push([ blockNamespace, blockAttributes, blockInnerBlocks ]);
	}
	
	return blockTemplate;
}