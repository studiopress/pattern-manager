// @ts-check

import { CheckboxControl } from '@wordpress/components';

export default function MultiCheckbox() {
	return (
		<div>
			<CheckboxControl
				label={ 'px unit' }
				checked={ true }
				onChange={ () => {} }
			/>
			<CheckboxControl
				label={ 'rem unit' }
				checked={ true }
				onChange={ () => {} }
			/>
		</div>
	);
}
