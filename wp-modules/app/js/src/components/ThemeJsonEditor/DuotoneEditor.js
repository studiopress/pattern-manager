// @ts-check

// WP Dependencies
import { ColorPicker, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';

export default function DuotoneEditor({properties, schemaPosition}) {
	const [popover1Open, setPopover1Open] = useState( false );
	const [popover2Open, setPopover2Open] = useState( false );
	const { currentThemeJsonFile } = useStudioContext();
	
	const nameValue = currentThemeJsonFile.getValue( 'settings', schemaPosition + '.name', properties.name.type );
	const slugValue = currentThemeJsonFile.getValue( 'settings', schemaPosition + '.slug', properties.slug.type );
	const color1Value = currentThemeJsonFile.getValue( 'settings', schemaPosition + '.colors.0', 'string' );
	console.log( schemaPosition + '.color.0' );
	const color2Value = currentThemeJsonFile.getValue( 'settings', schemaPosition + '.colors.1', 'string' );

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
					<div
						style={{
							width: '100px',
							height: '100px',
							backgroundColor: color1Value
						}}
						onClick={() => {
							setPopover1Open( true );
						}}
					>
						{ popover1Open ? 
							<Popover onFocusOutside={() => {
								setPopover1Open( false );
							}}>
								<ColorPicker
									color={ color1Value }
									// @ts-ignore The declaration file is wrong.
									onChange={ (newValue) => {
										currentThemeJsonFile.setValue( 'settings', schemaPosition + '.colors.0', newValue );
									} }
									enableAlpha
									defaultValue="#000"
								/>
							</Popover>
						: null }
					</div>
				</div>
				<div>
					<div
						style={{
							width: '100px',
							height: '100px',
							backgroundColor: color2Value
						}}
						onClick={() => {
							setPopover2Open( true );
						}}
					>
						{ popover2Open ? 
							<Popover onFocusOutside={() => {
								setPopover2Open( false );
							}}>
								<ColorPicker
									color={ color2Value }
									// @ts-ignore The declaration file is wrong.
									onChange={ (newValue) => {
										currentThemeJsonFile.setValue( 'settings', schemaPosition + '.colors.1', newValue );
									} }
									enableAlpha
									defaultValue="#000"
								/>
							</Popover>
						: null }
					</div>
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
