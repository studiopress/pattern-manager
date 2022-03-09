/**
 * @param {...string} classes
 * @return {string} The classes that apply.
 */
export function classNames( ...classes ) {
	return classes.filter( Boolean ).join( ' ' );
}
