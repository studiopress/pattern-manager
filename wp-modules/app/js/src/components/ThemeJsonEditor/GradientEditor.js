// @ts-check

// WP Dependencies
import { CustomGradientPicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';

export default function GradientEditor({properties, schemaPosition}) {
	const { currentThemeJsonFile } = useStudioContext();
	
	const nameValue = currentThemeJsonFile.getValue( 'settings', schemaPosition + ',name', properties.name.type );
	const slugValue = currentThemeJsonFile.getValue( 'settings', schemaPosition + ',slug', properties.slug.type );
	const gradientValue = currentThemeJsonFile.getValue( 'settings', schemaPosition + ',gradient', properties.gradient.type );

	return <div>
		<div className="name">
			<div>{ __( 'Name', 'fse-studio' ) }</div>
			<div>{ properties.name.description }</div>
			<input type="text" value={nameValue} onChange={(event) => {
				currentThemeJsonFile.setValue( 'settings', schemaPosition + ',name', event.target.value );
			}} />
		</div>
		<div className="slug">
			<div>{ __( 'Slug', 'fse-studio' ) }</div>
			<div>{ properties.slug.description }</div>
			<input type="text" value={slugValue} onChange={(event) => {
				currentThemeJsonFile.setValue( 'settings', schemaPosition + ',slug', event.target.value );
			}} />
		</div>
		<div className="gradient">
			<div>{ __( 'Name', 'fse-studio' ) }</div>
			<div>{ properties.gradient.description }</div>
			<div>
				<CustomGradientPicker
					value={ gradientValue }
					onChange={ (newValue) => {
						currentThemeJsonFile.setValue( 'settings', schemaPosition + ',gradient', newValue );
					}}
				/>
			</div>
		</div>
		<div>
			<button
				onClick={() => {
					currentThemeJsonFile.setValue( 'settings', schemaPosition, false );
				}}
			>
				{ __( 'Delete Gradient', 'fse-studioo' ) }
			</button>
		</div>
	</div>
}
