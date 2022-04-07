/**
 * Get a blank set of properties from a schema object.
 *
 * @param {object?} schemaProperties The schema that defines the properties to return.
 * @return {object} The properties with blank values.
 */
export default function getBlankArrayFromSchema(items) {
	console.log( items.type  );
	if ( items.type === 'string' ) {
		return '';
	}
		
	if ( items.type === 'boolean' ) {
		return false;
	}
	if ( items.type === 'object' ) {
		const properties = {};
		for( const property in items.properties ) {
			properties[property] = getBlankArrayFromSchema(items.properties[property]);
		}
		return properties;
	}
	if ( items.type === 'array' ) {
		return [];
	}
	
	return ''
}