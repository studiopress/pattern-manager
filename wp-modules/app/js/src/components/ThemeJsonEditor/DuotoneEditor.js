// @ts-check

// WP Dependencies
import { ColorPicker, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';

export default function DuotoneEditor( { properties, schemaPosition } ) {
	const [ popover1Open, setPopover1Open ] = useState( false );
	const [ popover2Open, setPopover2Open ] = useState( false );
	const { currentTheme } = useStudioContext();

	const nameValue = currentTheme.getThemeJsonValue(
		'settings',
		schemaPosition + '.name',
		properties.name.type
	);
	const slugValue = currentTheme.getThemeJsonValue(
		'settings',
		schemaPosition + '.slug',
		properties.slug.type
	);
	const color1Value = currentTheme.getThemeJsonValue(
		'settings',
		schemaPosition + '.colors.0',
		'string'
	);
	const color2Value = currentTheme.getThemeJsonValue(
		'settings',
		schemaPosition + '.colors.1',
		'string'
	);

	return (
		<div className="bg-gray-100 p-5 rounded">
			<div className="flex flex-wrap justify-between items-center gap-2 md:gap-12">
				<div className="flex flex-col gap-5 w-full">
					<div className="name flex flex-col space-y-1">
						<div className="font-semibold">
							{ __( 'Name', 'fse-studio' ) }
						</div>
						<div>{ properties.name.description }</div>
						<input
							type="text"
							value={ nameValue }
							onChange={ ( event ) => {
								currentTheme.setThemeJsonValue(
									'settings',
									schemaPosition + '.name',
									event.target.value
								);
							} }
						/>
					</div>
					<div className="slug flex flex-col space-y-1">
						<div className="font-semibold">
							{ __( 'Slug', 'fse-studio' ) }
						</div>
						<div>{ properties.slug.description }</div>
						<input
							type="text"
							value={ slugValue }
							onChange={ ( event ) => {
								currentTheme.setThemeJsonValue(
									'settings',
									schemaPosition + '.slug',
									event.target.value
								);
							} }
						/>
					</div>
				</div>
				<div className="gradient mt-8 flex flex-col gap-3 w-full">
					<button
						onClick={ () => {
							setPopover1Open( true );
						} }
						className="bg-white rounded-md shadow-sm p-4 hover:shadow transition ease-in-out hover:cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<span
								className="h-10 w-10 rounded-full inline-block border border-gray-200"
								style={ {
									backgroundColor: color1Value,
								} }
							></span>
							<span className="font-semibold text-left">
								{ __( 'Duotone Highlight', 'fse-studio' ) }{ ' ' }
								<br />
								<small className="text-gray-500">
									{ color1Value ? color1Value : null }
								</small>
							</span>
							{ popover1Open ? (
								<Popover
									onFocusOutside={ () => {
										setPopover1Open( false );
									} }
								>
									<ColorPicker
										color={ color1Value }
										// @ts-ignore The declaration file is wrong.
										onChange={ ( newValue ) => {
											currentTheme.setThemeJsonValue(
												'settings',
												schemaPosition + '.colors.0',
												newValue
											);
										} }
										enableAlpha
										defaultValue="#000"
									/>
								</Popover>
							) : null }
						</div>
					</button>
					<button
						onClick={ () => {
							setPopover2Open( true );
						} }
						className="bg-white rounded-md shadow-sm p-4 hover:shadow transition ease-in-out hover:cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<span
								className="h-10 w-10 rounded-full inline-block border border-gray-200"
								style={ {
									backgroundColor: color2Value,
								} }
							></span>
							<span className="font-semibold text-left">
								{ __( 'Duotone Shadow', 'fse-studio' ) } <br />
								<small className="text-gray-500">
									{ color2Value ? color2Value : null }
								</small>
							</span>
							{ popover2Open ? (
								<Popover
									onFocusOutside={ () => {
										setPopover2Open( false );
									} }
								>
									<ColorPicker
										color={ color2Value }
										// @ts-ignore The declaration file is wrong.
										onChange={ ( newValue ) => {
											currentTheme.setThemeJsonValue(
												'settings',
												schemaPosition + '.colors.1',
												newValue
											);
										} }
										enableAlpha
										defaultValue="#000"
									/>
								</Popover>
							) : null }
						</div>
					</button>
				</div>
			</div>
			<div className="text-right border-t border-dotted border-gray-300 pt-3 mt-5">
				<button
					className="text-red-500 hover:text-red-700"
					onClick={ ( e ) => {
						e.preventDefault();
						if (
							/* eslint-disable */
							window.confirm(
								__(
									'Are you sure you want to delete this item?',
									'fse-studio'
								)
							)
							/* eslint-enable */
						) {
							currentTheme.setThemeJsonValue(
								'settings',
								schemaPosition
							);
						}
					} }
				>
					{ __( 'Delete Color Palette Option', 'fse-studio' ) }
				</button>
			</div>
		</div>
	);
}
