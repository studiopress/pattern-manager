// WP Dependencies
import { ColorPicker, Popover } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';

type Props = {
	properties: {
		name: { [ key: string ]: string };
		slug: { [ key: string ]: string };
		color: { [ key: string ]: string };
	};
	schemaPosition: string;
};

export default function PaletteEditor( { properties, schemaPosition }: Props ) {
	const [ popoverOpen, setPopoverOpen ] = useState( false );
	const { currentTheme } = useStudioContext();
	const inputId = useInstanceId( PaletteEditor );

	const nameValue = currentTheme.getThemeJsonValue(
		'settings',
		schemaPosition + '.name',
		properties.name.type
	) as string;
	const slugValue = currentTheme.getThemeJsonValue(
		'settings',
		schemaPosition + '.slug',
		properties.slug.type
	) as string;
	const colorValue = currentTheme.getThemeJsonValue(
		'settings',
		schemaPosition + '.color',
		properties.color.type
	) as string;

	return (
		<div className="bg-gray-100 p-5 rounded">
			<div className="flex flex-wrap lg:flex-nowrap items-end gap-8 lg:gap-12">
				<div className="flex flex-col gap-5 w-full lg:w-1/2">
					<div className="name flex flex-col space-y-1">
						<label
							htmlFor={ `palette-name-${ inputId }` }
							className="font-semibold"
						>
							{ __( 'Name', 'fse-studio' ) }
						</label>
						<span>{ properties.name.description }</span>
						<input
							type="text"
							id={ `palette-name-${ inputId }` }
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
						<label
							htmlFor={ `palette-slug-${ inputId }` }
							className="font-semibold"
						>
							{ __( 'Slug', 'fse-studio' ) }
						</label>
						<span>{ properties.slug.description }</span>
						<input
							type="text"
							id={ `palette-slug-${ inputId }` }
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
				<div className="palette w-full lg:w-1/2">
					<div>
						<button
							onClick={ () => {
								setPopoverOpen( true );
							} }
							className="bg-white rounded-md shadow-sm p-4 hover:shadow transition ease-in-out hover:cursor-pointer w-full"
						>
							<div className="flex items-center gap-3">
								<span
									className="h-10 w-10 rounded-full inline-block border border-gray-200"
									style={ {
										backgroundColor: colorValue,
									} }
								></span>
								<span className="font-semibold text-left">
									{ __( 'Choose Color', 'fse-studio' ) }{ ' ' }
									<br />
									<small className="text-gray-500">
										{ colorValue ? colorValue : null }
									</small>
								</span>
								{ popoverOpen ? (
									<Popover
										onFocusOutside={ () => {
											setPopoverOpen( false );
										} }
									>
										<ColorPicker
											color={ colorValue }
											// @ts-ignore The declaration file is wrong.
											onChange={ ( newValue ) => {
												currentTheme.setThemeJsonValue(
													'settings',
													schemaPosition + '.color',
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
			</div>
			<div className="text-right border-t border-dotted border-gray-300 pt-3 mt-5">
				<button
					className="text-red-700 hover:text-red-800"
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
