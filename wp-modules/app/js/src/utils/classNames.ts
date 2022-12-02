/* eslint-disable jsdoc/require-param-type, jsdoc/require-returns-type */

/**
 * @param  classes
 * @return The filtered classes that apply.
 */
export default function classNames( ...classes: string[] ) {
	return classes.filter( Boolean ).join( ' ' );
}
