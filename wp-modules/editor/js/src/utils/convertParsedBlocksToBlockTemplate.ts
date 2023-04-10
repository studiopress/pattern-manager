type Block = {
	name: string;
	attributes: Record< string, unknown >;
	innerBlocks?: Block[];
};

export default function convertParsedBlocksToBlockTemplate(
	parsedBlocks: Block[]
) {
	return parsedBlocks.map( ( block ) => {
		return [
			block?.name,
			block?.attributes,
			block?.innerBlocks
				? convertParsedBlocksToBlockTemplate( block?.innerBlocks )
				: undefined,
		];
	} );
}
