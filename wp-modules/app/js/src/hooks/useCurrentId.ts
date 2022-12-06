import { useState } from '@wordpress/element';

export default function useCurrentId( initialId: string ) {
	const [ value, set ] = useState( initialId );

	return {
		value,
		set,
	};
}
