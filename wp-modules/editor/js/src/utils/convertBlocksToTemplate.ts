type Block = {
	name: string;
	attributes: Record< string, unknown >;
	innerBlocks?: Block[];
};

export default function convertBlocksToTemplate( parsedBlocks: Block[] ) {
	return parsedBlocks.map( ( block ) => {
		return [
			block.name,
			block.attributes,
			block?.innerBlocks
				? convertBlocksToTemplate( block?.innerBlocks )
				: undefined,
		];
	} );
}
