// @ts-check

// WP Dependencies
import { CustomGradientPicker } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

import useStudioContext from '../../hooks/useStudioContext';

export default function GradientEditor( { properties, schemaPosition } ) {
	const { currentTheme } = useStudioContext();
	const inputId = useInstanceId( GradientEditor );

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
	const gradientValue = currentTheme.getThemeJsonValue(
		'settings',
		schemaPosition + '.gradient',
		properties.gradient.type
	);

	return (
		<div className="bg-gray-100 p-5 rounded">
			<div className="flex flex-wrap lg:flex-nowrap items-end gap-8 lg:gap-12">
				<div className="flex flex-col gap-5 w-full lg:w-1/2">
					<div className="name flex flex-col space-y-1">
						<label
							htmlFor={ `gradient-name-${ inputId }` }
							className="font-semibold"
						>
							{ __( 'Name', 'fse-studio' ) }
						</label>
						<span>{ properties.name.description }</span>
						<input
							type="text"
							id={ `gradient-name-${ inputId }` }
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
							htmlFor={ `gradient-slug-${ inputId }` }
							className="font-semibold"
						>
							{ __( 'Slug', 'fse-studio' ) }
						</label>
						<span>{ properties.slug.description }</span>
						<input
							type="text"
							id={ `gradient-slug-${ inputId }` }
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
				<div className="gradient w-full lg:w-1/2">
					<div>
						<CustomGradientPicker
							value={ gradientValue }
							onChange={ ( newValue ) => {
								currentTheme.setThemeJsonValue(
									'settings',
									schemaPosition + '.gradient',
									newValue
								);
							} }
						/>
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
					{ __( 'Delete Gradient', 'fse-studio' ) }
				</button>
			</div>
		</div>
	);
}
