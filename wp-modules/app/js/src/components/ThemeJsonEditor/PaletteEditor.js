// @ts-check

// WP Dependencies
import { ColorPicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';

export default function PaletteEditor({properties, schemaPosition}) {
	const { currentThemeJsonFile } = useStudioContext();
	
	const nameValue = currentThemeJsonFile.getValue( 'settings', schemaPosition + '.name', properties.name.type );
	const slugValue = currentThemeJsonFile.getValue( 'settings', schemaPosition + '.slug', properties.slug.type );
	const colorValue = currentThemeJsonFile.getValue( 'settings', schemaPosition + '.color', properties.color.type );

	return <div className="bg-gray-100 p-5 rounded">
		<div className="flex justify-between items-center gap-5">
			<div className="flex flex-col gap-5">
				<div className="name flex flex-col space-y-1">
					<div className="font-semibold">{ __( 'Name', 'fse-studio' ) }</div>
					<div>{ properties.name.description }</div>
					<input type="text" value={nameValue} onChange={(event) => {
						currentThemeJsonFile.setValue( 'settings', schemaPosition + '.name', event.target.value );
					}} />
				</div>
				<div className="slug flex flex-col space-y-1">
					<div className="font-semibold">{ __( 'Slug', 'fse-studio' ) }</div>
					<div>{ properties.slug.description }</div>
					<input type="text" value={slugValue} onChange={(event) => {
						currentThemeJsonFile.setValue( 'settings', schemaPosition + '.slug', event.target.value );
					}} />
				</div>
			</div>
			<div className="gradient mt-12">
				<div>
					<ColorPicker
						color={ colorValue }
						// @ts-ignore The declaration file is wrong.
						onChange={ (newValue) => {
							currentThemeJsonFile.setValue( 'settings', schemaPosition + '.color', newValue );
						} }
						enableAlpha
						defaultValue="#000"
					/>
				</div>
			</div>
		</div>
		<div className="text-right border-t border-dotted border-gray-300 pt-3 mt-5">
			<button
				className="text-red-500 hover:text-red-700"
				onClick={(e) => {
					e.preventDefault();
					if ( window.confirm( __( 'Are you sure you want to delete this item?', 'fse-studio' ) ) ) {
						currentThemeJsonFile.setValue( 'settings', schemaPosition );
					}
				}}
			>
				{ __( 'Delete Color Palette Option', 'fse-studio' ) }
			</button>
		</div>
	</div>
}
