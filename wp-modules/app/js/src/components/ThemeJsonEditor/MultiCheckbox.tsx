import { CheckboxControl } from '@wordpress/components';

type Props = {
	value: string[];
	onChange: ( newValue: string[] ) => unknown;
};

export default function MultiCheckbox( { value = [], onChange }: Props ) {
	const units = [ 'px', 'em', 'rem', 'vh', 'vw', '%' ];

	return (
		<>
			{ units.map( ( unit ) => {
				return (
					<CheckboxControl
						key={ unit }
						label={ unit }
						checked={ value.includes( unit ) }
						onChange={ ( isChecked ) => {
							if ( isChecked && value.includes( unit ) ) {
								return;
							}

							const newUnits = isChecked
								? [ ...value, unit ]
								: value.filter( ( previousUnit ) => {
										return unit !== previousUnit;
								  } );
							onChange( newUnits );
						} }
					/>
				);
			} ) }
		</>
	);
}
