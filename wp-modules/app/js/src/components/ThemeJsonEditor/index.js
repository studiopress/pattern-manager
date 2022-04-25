// @ts-check

// WP Dependencies
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, check } from '@wordpress/icons';
import { Spinner } from '@wordpress/components';

import useStudioContext from '../../hooks/useStudioContext';

import getBlankArrayFromSchema from '../../utils/getBlankSetOfProperties';
import convertToUpperCase from '../../utils/convertToUpperCase';

import { fsestudio } from '../../globals';

import GradientEditor from './GradientEditor';
import PaletteEditor from './PaletteEditor';
import DuotoneEditor from './DuotoneEditor';
import MultiCheckbox from './MultiCheckbox';
import convertToCssClass from '../../utils/convertToCssClass';

/** @param {{visible: boolean}} props */
export default function ThemeJsonEditor( { visible } ) {
	/* eslint-disable */
	const { themeJsonFiles, currentTheme, currentThemeJsonFileId, currentThemeJsonFile } = useStudioContext();

	function renderSelector() {
		const renderedOptions = [];

		renderedOptions.push(
			<option key={ 1 }>
				{ __( 'Choose a Theme JSON File', 'fse-studio' ) }
			</option>
		);

		let counter = 3;

		for ( const fileId in themeJsonFiles.themeJsonFiles ) {
			const optionInQuestion = themeJsonFiles.themeJsonFiles[ fileId ];

			renderedOptions.push(
				<option key={ counter } value={ optionInQuestion.name }>
					{ optionInQuestion.name }
				</option>
			);
			counter++;
		}

		return (
			<select
				value={ currentThemeJsonFileId.value }
				onChange={ ( event ) => {
					currentTheme.set( {
						...currentTheme.data,
						theme_json_file: event.target.value,
					} )
				} }
			>
				{ renderedOptions }
			</select>
		);
	}

	function renderThemeEditorWhenReady() {
		if ( ! currentThemeJsonFile.data ) {
			return <Spinner />;
		}
		
		if ( 'themejson_file_not_found' === currentThemeJsonFile.data?.error ) {
			return __( 'No theme.json file found with the name ' + currentThemeJsonFileId.value );
		}
	
		return <ThemeJsonDataEditor themeJsonFile={ currentThemeJsonFile } theme={ currentTheme } />;
	}

	return (
		<div hidden={ ! visible } className="fsestudio-theme-manager p-12">
			<div className="max-w-7xl mx-auto bg-white shadow">
				<h1 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">
					{ __( 'Theme.json Manager', 'fse-studio' ) }
				</h1>
				<div className="px-4 sm:px-6 md:px-8 bg-[#F8F8F8] py-8 flex sm:flex-row flex-col items-end">
					{/*
					<div>
						<label
							htmlFor="location"
							className="block text-sm font-medium text-gray-700"
						>
							{ __( 'Choose a theme JSON file', 'fse-studio' ) }
						</label>
						{ renderSelector() }
					</div>
					<div className="flex flex-col mx-6 my-2.5">
						{ __( 'or', 'fse-studio' ) }
					</div>
					*/
					}
					<div className="flex flex-col gap-2">
						<button
							type="button"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => {
								const newData = {
									name: 'new',
									content: '',
								};

								themeJsonFiles.setThemeJsonFiles( {
									...themeJsonFiles.themeJsonFiles,
									my: newData,
								} );
							} }
						>
							{ __(
								'Create a new theme JSON file',
								'fse-studio'
							) }
						</button>
						<button
							type="button"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => {
								currentThemeJsonFile.save();
								currentTheme.save();
							} }
						>
							{ __( 'Save Theme and Theme Configuration File', 'fse-studio' ) }
						</button>
					</div>
				</div>
				{ renderThemeEditorWhenReady() }
			</div>
		</div>
	);
}

function ThemeJsonDataEditor( { themeJsonFile, theme } ) {
	return (
		<>
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
						{ themeJsonFile.hasSaved ?
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
								themeJsonFile.save();
								theme.save();
							} }
						>
							{ __( 'Save Settings & Styles', 'fse-studio' ) }
						</button>
					</div>
				</div>
			</div>
		</>
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
	const { currentThemeJsonFile } = useStudioContext();
	const [ currentView, setCurrentView ] = useState( 'color' );
	
	// Use the themeJson schema and currentThemeJsonFile to generate the settings and values.
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
							{ convertToUpperCase( item.name ) }
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
						<h2>{ convertToUpperCase( propertyName ) }</h2>
						<p>{properties[propertyName].description}</p>
					</label>
					<div className={`mt-1 sm:mt-0 sm:col-span-3 space-y-5 fses-property fses-${convertToCssClass(schemaPosition + '.' + propertyName)}`}>
						<RenderProperty
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
	const { currentThemeJsonFile } = useStudioContext();
	const currentValue = currentThemeJsonFile.getValue( 'settings', schemaPosition, propertySchema.default );

	if ( propertySchema.type === 'boolean' || propertySchema.oneOf ) {
		return <input
			
			type="checkbox"
			id={propertyName}
			name={propertyName}
			checked={ currentValue }
			onChange={( event ) => {
				currentThemeJsonFile.setValue( 'settings', schemaPosition, currentValue ? false : true, propertySchema?.default );
			}}
		/>
	}
	if (
		propertySchema.type === 'string' || propertySchema.type === 'number'
	) {
		
		return <ValueSetter
			name={ propertyName }
			value={ currentValue }
			onChange={ (newValue) => {
				currentThemeJsonFile.setValue( 'settings', schemaPosition, newValue, propertySchema?.default );
			}}
		/>
	}
	if ( propertySchema.type === 'object' ) {
		return <RenderProperties
			isVisible={isVisible}
			properties={propertySchema.properties}
			schemaPosition={schemaPosition}
			topLevelSettingName={topLevelSettingName}
		/>
	}
	if ( propertySchema.type === 'array' ) {
		if ( schemaPosition === 'spacing.units' ) {
			return <MultiCheckbox 
				value={ currentValue }
				onChange={ ( newValue ) => {
					currentThemeJsonFile.setValue( 'settings', schemaPosition, newValue, propertySchema?.default );
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
								properties={propertySchema.items.properties}
								schemaPosition={schemaPosition + '.' + arrIndex}
							/>
						);
					} else if ( propertyName === 'palette' ) {
						rendered.push(
							<PaletteEditor
								properties={propertySchema.items.properties}
								schemaPosition={schemaPosition + '.' + arrIndex}
							/>
						);
					} else if ( propertyName === 'duotone' ) {
						rendered.push(
							<DuotoneEditor
								properties={propertySchema.items.properties}
								schemaPosition={schemaPosition + '.' + arrIndex}
							/>
						);
					} else {
						// Render the properties in the schema, using the current loop's values for the properties
						rendered.push(
							<RenderProperties
								key={arrIndex}
								isVisible={isVisible}
								properties={propertySchema.items.properties}
								schemaPosition={schemaPosition + '.' + arrIndex}
								topLevelSettingName={topLevelSettingName}
							/>
						)
					}
				} else {
					rendered.push(
						<div key={arrIndex} hidden={!isVisible}>
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
				<>
					<button 
						onClick={() => {
							currentThemeJsonFile.setValue( 'settings', schemaPosition + '.' + Object.keys(currentValue).length, getBlankArrayFromSchema(propertySchema.items), null, 'insert' );
						}}
						className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue my-5"
					>
						{ __( 'Add Another', 'fse-studio' ) }
					</button>
					<button
						className="text-red-500 hover:text-red-700 hidden"
						onClick={(e) => {
							e.preventDefault();
							if ( window.confirm( __( 'Are you sure you want to delete this item?', 'fse-studio' ) ) ) {
								currentThemeJsonFile.setValue( 'settings', schemaPosition + '.' + Object.keys(currentValue).length );
							}
						}}
					>
						{ __( 'Delete', 'fse-studio' ) }
					</button>
				</>
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
