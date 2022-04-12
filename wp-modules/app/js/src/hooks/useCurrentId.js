// @ts-check

import { useState } from '@wordpress/element';

/** @param {string} [initialId] */
export default function useCurrentId( initialId ) {
	const [ value, set ] = useState( initialId );

	return {
		value,
		set,
	};
}
