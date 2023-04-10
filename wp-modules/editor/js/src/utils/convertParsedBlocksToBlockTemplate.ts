export default function convertParsedBlocksToBlockTemplate(
	parsedBlocks,
	blockTemplate
) {
	return [
		...blockTemplate,
		...parsedBlocks.map( ( block ) => {
			return [
				block?.name,
				block?.attributes,
				block?.innerBlocks
					? convertParsedBlocksToBlockTemplate(
							block?.innerBlocks,
							[]
					  )
					: undefined,
			];
		} ),
	];
}
