// @ts-check

// WP Dependencies
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, check } from '@wordpress/icons';
import { Spinner } from '@wordpress/components';

import useStudioContext from '../../hooks/useStudioContext';

import getBlankArrayFromSchema from '../../utils/getBlankSetOfProperties';

import { fsestudio } from '../../globals';

import GradientEditor from './GradientEditor';
import PaletteEditor from './PaletteEditor';
import DuotoneEditor from './DuotoneEditor';
import MultiCheckbox from './MultiCheckbox';
import convertToCssClass from '../../utils/convertToCssClass';

/** @param {{visible: boolean}} props */
export default function ThemeJsonEditor( { visible } ) {
	/* eslint-disable */
	const { currentTheme } = useStudioContext();
	
	if ( ! currentTheme?.data?.theme_json_file ) {
		return ''
	}
	
	return (
		<div hidden={ ! visible } className="fsestudio-theme-manager">
			<div className="bg-fses-gray mx-auto p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-4xl mb-3">{ __( 'Styles and Settings', 'fse-studio' ) }</h2>
					<p className="text-lg max-w-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto bg-white shadow">
				<h1 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">
					{ __( 'Theme.json Manager', 'fse-studio' ) }
				</h1>
				<div>
					<div className="flex flex-row px-4 sm:px-6 md:px-8 py-8 gap-14">
						<SettingsView isVisible={ true } />
					</div>
				</div>
				<div className="p-5 text-xl border-t border-gray-200 px-4 sm:px-6 md:px-8 flex items-center sticky bottom-0 bg-[rgba(255,255,255,.8)] backdrop-blur-sm">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center">
							<p className="text-sm m-0">{ __( 'This theme.json file can be found in your active theme.', 'fse-studio' ) }</p>
						</div>
						<div className="flex items-center">
							{ currentTheme.hasSaved ?
								(
									<span className="text-sm text-green-600 flex flex-row items-center mr-6">
										<Icon
											className="fill-current"
											icon={ check }
											size={ 26 }
										/>{ ' ' }
										{ __( 'Settings Saved!', 'fse-studio' ) }
									</span>
								) : null
							}
							<button
								type="button"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
								onClick={ () => {
									currentTheme.save();
								} }
							>
								{ __( 'Save Settings & Styles', 'fse-studio' ) }
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function getSettingsFromThemeJsonSchema() {

	const listOfSettingsInSchema = {};
	
	const propertiesComplete = fsestudio.schemas.themejson.definitions['settingsPropertiesComplete'];

	for ( const setting in fsestudio.schemas.themejson.definitions ) {
		// Skip schemas that are not settings.
		if ( setting === 'settingsPropertiesComplete' || ! setting.startsWith( 'settingsProperties' ) ) { continue }
		
		// Get the data for this setting from the schema.
		const settingData = fsestudio.schemas.themejson.definitions[setting];
	
		// Loop through each property in each setting in the schema.
		for ( const propertyName in settingData.properties ) {
			// If this is not a "setting" that is defined inside propertiesComplete, skip it.
			if ( ! ( propertyName in propertiesComplete.allOf[1].properties ) ) { continue }
			
			// FSE Studio does not yet handle the "blocks"
			if ( ! ( propertyName in propertiesComplete.allOf[1].properties ) ) { continue }

			listOfSettingsInSchema[propertyName] = settingData;
		}
	}
	
	return listOfSettingsInSchema;
}

function SettingsView({ isVisible }) {
	const { currentTheme } = useStudioContext();
	const [ currentView, setCurrentView ] = useState( 'color' );
	
	// Use the themeJson schema and currentTheme.themeJson to generate the settings and values.
	const rendered = [];
	const tabs = [];
	
	const settings = getSettingsFromThemeJsonSchema();
	
	for ( const setting in settings ) {
		for ( const propertyName in settings[setting].properties ) {
			if ( settings[setting].properties[propertyName].type === 'object' ) {
				rendered.push(
					<RenderProperty
						key={propertyName}
						isVisible={ currentView === setting }
						propertySchema={settings[setting].properties[propertyName]}
						propertyName={propertyName}
						schemaPosition={propertyName}
						topLevelSettingName={setting}
					/>
				)
			} else {
				rendered.push(
					<RenderProperties
						key={propertyName}
						isVisible={ currentView === setting }
						properties={settings[setting].properties}
						schemaPosition={''}
						topLevelSettingName={setting}
					/>
				)
			}
		}

		tabs.push({
			name: setting,
			slug: setting,
		});
	}

	return <div hidden={!isVisible}>
		<p>{ fsestudio.schemas.themejson.properties['settings'].description }</p>
		<div className="flex flex-row gap-14 mt-4">
			<ul className="w-[180px] min-w-[180px]">
				{ tabs.map( ( item ) => (
					<li key={ item.name }>
						<button
							className={
								'w-full text-left p-5 font-medium' +
								( currentView === item.slug
									? ' bg-gray-100'
									: ' hover:bg-gray-100' )
							}
							key={ item.name }
							onClick={ () => {
								setCurrentView( item.slug );
							} }
						>
							{ item.name }
						</button>
					</li>
				) ) }
			</ul>
			<div className="w-full fses-settings-wrap">{ rendered }</div>
		</div>
	</div>
}

function RenderProperties( { isVisible, properties, schemaPosition, topLevelSettingName } ) {
	const renderedProperties = [];

	for( const propertyName in properties ) {
		renderedProperties.push(
			<div key={propertyName} hidden={!isVisible} className={`fses-${convertToCssClass(propertyName)} fses-type-${convertToCssClass(properties[propertyName].type) || "boolean" }`}>
				<div className="grid grid-cols-4 gap-6 py-6 items-top">
					<label
						htmlFor={propertyName}
						className="block text-sm font-medium text-gray-700 sm:col-span-1 fses-label max-w-[500px]"
					>
						<h2>{ propertyName }</h2>
						<p>{properties[propertyName].description}</p>
					</label>
					<div className={`mt-1 sm:mt-0 sm:col-span-3 space-y-5 fses-property fses-${convertToCssClass(schemaPosition + '.' + propertyName)}`}>
						<RenderProperty
							key={propertyName}
							isVisible={isVisible}
							propertySchema={properties[propertyName]}
							propertyName={propertyName}
							schemaPosition={schemaPosition + '.' + propertyName }
							topLevelSettingName={topLevelSettingName}
						/>
					</div>
				</div>
			</div>
		)
	}
	
	return <div className={`divide-y divide-gray-200 fses-${convertToCssClass(schemaPosition)}`}>{renderedProperties}</div>
}


function RenderProperty( {isVisible, propertySchema, propertyName, schemaPosition, topLevelSettingName } ) {
	const { currentTheme } = useStudioContext();
	const currentValue = currentTheme.getThemeJsonValue( 'settings', schemaPosition, propertySchema.default );

	if ( propertySchema.type === 'boolean' || propertySchema.oneOf ) {
		return <input
			key={schemaPosition}
			type="checkbox"
			id={propertyName}
			name={propertyName}
			checked={ currentValue }
			onChange={( event ) => {
				currentTheme.setThemeJsonValue( 'settings', schemaPosition, currentValue ? false : true, propertySchema?.default );
			}}
		/>
	}
	if (
		propertySchema.type === 'string' || propertySchema.type === 'number'
	) {
		
		return <ValueSetter
			key={schemaPosition}
			name={ propertyName }
			value={ currentValue }
			onChange={ (newValue) => {
				currentTheme.setThemeJsonValue( 'settings', schemaPosition, newValue, propertySchema?.default );
			}}
		/>
	}
	if ( propertySchema.type === 'object' ) {
		return <RenderProperties
			key={schemaPosition}
			isVisible={isVisible}
			properties={propertySchema.properties}
			schemaPosition={schemaPosition}
			topLevelSettingName={topLevelSettingName}
		/>
	}
	if ( propertySchema.type === 'array' ) {
		if ( schemaPosition === 'spacing.units' ) {
			return <MultiCheckbox
				key={schemaPosition}
				value={ currentValue }
				onChange={ ( newValue ) => {
					currentTheme.setThemeJsonValue( 'settings', schemaPosition, newValue, propertySchema?.default );
				} }
			/>
		}

		const rendered = [];

		// If this setting does not exist in the current theme.json file.
		if ( ! currentValue ) {
			return 'Nothing yet!';
		} else {
			// Loop through each saved item in the theme.json file for this array.
			for ( const arrIndex in currentValue ) {
				// If these array items are objects (an array of objects)
				if ( propertySchema.items.type === 'object' ) {
					// If this is a gradient, render each graidnet using our custom component.
					if ( propertyName === 'gradients' ) {
						rendered.push(
							<GradientEditor
								key={schemaPosition + '.' + arrIndex}
								properties={propertySchema.items.properties}
								schemaPosition={schemaPosition + '.' + arrIndex}
							/>
						);
					} else if ( propertyName === 'palette' ) {
						rendered.push(
							<PaletteEditor
								key={schemaPosition + '.' + arrIndex}
								properties={propertySchema.items.properties}
								schemaPosition={schemaPosition + '.' + arrIndex}
							/>
						);
					} else if ( propertyName === 'duotone' ) {
						rendered.push(
							<DuotoneEditor
								key={schemaPosition + '.' + arrIndex}
								properties={propertySchema.items.properties}
								schemaPosition={schemaPosition + '.' + arrIndex}
							/>
						);
					} else {
						// Render the properties in the schema, using the current loop's values for the properties
						rendered.push(
							<RenderProperties
								key={schemaPosition + '.' + arrIndex}
								isVisible={isVisible}
								properties={propertySchema.items.properties}
								schemaPosition={schemaPosition + '.' + arrIndex}
								topLevelSettingName={topLevelSettingName}
							/>
						)
					}
				} else {
					rendered.push(
						<div key={schemaPosition + '.' + arrIndex } hidden={!isVisible}>
							<div className="sm:grid sm:grid-cols-4 sm:gap-4 py-6 sm:items-top">
								<div className="mt-1 sm:mt-0 sm:col-span-3 divide-y">
									<RenderProperty
										isVisible={isVisible}
										propertySchema={propertySchema.items}
										propertyName={propertyName}
										schemaPosition={schemaPosition + '.' + arrIndex }
										topLevelSettingName={topLevelSettingName}
									/>
								</div>
							</div>
						</div>
					)
				}
			}

			rendered.push(
				<div key={'addAndRemoveButtons'}>
					<button 
						key={'addAnother'}
						onClick={() => {
							currentTheme.setThemeJsonValue( 'settings', schemaPosition + '.' + Object.keys(currentValue).length, getBlankArrayFromSchema(propertySchema.items), null, 'insert' );
						}}
						className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue my-5"
					>
						{ __( 'Add Another', 'fse-studio' ) }
					</button>
					<button
						key={'delete'}
						className="text-red-500 hover:text-red-700 hidden"
						onClick={(e) => {
							e.preventDefault();
							if ( window.confirm( __( 'Are you sure you want to delete this item?', 'fse-studio' ) ) ) {
								currentTheme.setThemeJsonValue( 'settings', schemaPosition + '.' + Object.keys(currentValue).length );
							}
						}}
					>
						{ __( 'Delete', 'fse-studio' ) }
					</button>
				</div>
			)
		}
		return rendered;
	}
	
	return null;
	
}

function ValueSetter({name, value, onChange}) {
	
	return <input name={name} type="text" value={value} onChange={(event) => {
		onChange(event.target.value);
	}} />
}
