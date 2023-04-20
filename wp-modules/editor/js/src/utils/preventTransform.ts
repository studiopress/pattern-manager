import type { Block } from '../types';

type Transform = {
	blocks: string[];
	type: string;
	isMatch?: IsMatch;
};

type Transforms = {
	from?: Transform[];
	to?: Transform[];
};

type IsMatch = (
	attributes: Record< string, unknown >,
	blocks: Block[]
) => boolean;

function getTransforms( transforms: Transforms ) {
	return {
		...transforms,
		...( transforms.from && { from: removeWildcard( transforms.from ) } ),
	};
}

function removeWildcard( from: Transform[] ) {
	return from.map( ( transform ) => {
		return transform.type === 'block' &&
			transform?.blocks?.length === 1 &&
			transform.blocks[ 0 ] === '*'
			? {
					...transform,
					isMatch: ( ...args: Parameters< IsMatch > ) => {
						const [ , blocks ] = args;
						return blocks?.length === 1 &&
							blocks[ 0 ].name === 'core/pattern'
							? false
							: transform?.isMatch?.( ...args );
					},
			  }
			: transform;
	} );
}

/** Disallows transforming the PM Pattern Block to 'core/columns' or 'core/group'. */
export default function preventTransform(
	settings: { transforms: Transforms } & Record< string, unknown >,
	name: string
) {
	return name === 'core/columns' || name === 'core/group'
		? {
				...settings,
				...( settings.transforms && {
					transforms: getTransforms( settings.transforms ),
				} ),
		  }
		: settings;
}
