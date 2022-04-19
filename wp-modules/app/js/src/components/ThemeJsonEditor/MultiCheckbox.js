// @ts-check

import { CheckboxControl } from '@wordpress/components';

export default function MultiCheckbox() {
	const units = [
		'px',
        'em',
        'rem',
        'vh',
        'vw',
        '%'
	];

	return (
		<div>
			{ units.map( ( unit ) => {
				return <CheckboxControl
					label={ unit }
					checked={ true }
					onChange={ () => {} }
				/>;
			})}
		</div>
	);
}
