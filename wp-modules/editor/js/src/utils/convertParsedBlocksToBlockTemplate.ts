export default function convertParsedBlocksToBlockTemplate(
	parsedBlocks,
	blockTemplate
) {
	return [
		...blockTemplate,
		...parsedBlocks.map( ( block ) => {
			const blockNamespace = block?.name;
			const blockAttributes = block?.attributes;
			let blockInnerBlocks = block?.innerBlocks;

			if ( blockInnerBlocks ) {
				blockInnerBlocks = convertParsedBlocksToBlockTemplate(
					blockInnerBlocks,
					[]
				);
			}

			return [
				blockNamespace,
				blockAttributes,
				block?.innerBlocks
					? convertParsedBlocksToBlockTemplate( blockInnerBlocks, [] )
					: undefined,
			];
		} )
	];
}
