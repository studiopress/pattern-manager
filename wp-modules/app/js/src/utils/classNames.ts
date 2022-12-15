/** Gets the filtered classes that apply. */
export default function classNames( ...classes: string[] ) {
	return classes.filter( Boolean ).join( ' ' );
}
