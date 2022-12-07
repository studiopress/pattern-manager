/* eslint-disable no-undef, jsdoc/require-param-type, jsdoc/require-returns-type */

type BlankProperties = [] | '' | false;
type Properties = BlankProperties | { [ key: string ]: Properties };
type Items =
	| {
			type: 'string' | 'boolean' | 'array';
	  }
	| {
			type: 'object';
			properties: { [ key: string ]: Items };
	  };

/**
 * Get a blank set of properties from a schema object.
 *
 * @param  items The schema that defines the properties to return.
 * @return The properties with blank values.
 */
export default function getBlankArrayFromSchema( items: Items ): Properties {
	if ( items.type === 'string' ) {
		return '';
	}

	if ( items.type === 'boolean' ) {
		return false;
	}

	if ( items.type === 'object' ) {
		return Object.entries( items.properties ).reduce(
			( acc, [ key, value ] ) => {
				return { ...acc, [ key ]: getBlankArrayFromSchema( value ) };
			},
			{}
		);
	}

	if ( items.type === 'array' ) {
		return [];
	}
}
