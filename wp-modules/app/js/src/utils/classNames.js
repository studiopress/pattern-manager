/**
 * @param {...string} classes
 * @return {string} The classes that apply.
 */
export default function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}
