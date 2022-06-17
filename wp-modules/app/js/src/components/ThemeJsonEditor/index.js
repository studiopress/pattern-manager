// @ts-check

// WP Dependencies
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, check } from '@wordpress/icons';

import useStudioContext from '../../hooks/useStudioContext';

import getBlankArrayFromSchema from '../../utils/getBlankSetOfProperties';

import { fsestudio } from '../../globals';

import GradientEditor from './GradientEditor';
import PaletteEditor from './PaletteEditor';
import DuotoneEditor from './DuotoneEditor';
import MultiCheckbox from './MultiCheckbox';
import convertToCssClass from '../../utils/convertToCssClass';

import convertToUpperCase from '../../utils/convertToUpperCase';

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
					<h1 className="text-4xl mb-3">{ __( 'Styles and Settings', 'fse-studio' ) }</h1>
					<p className="text-lg max-w-2xl">All of the settings below belong to your theme's theme.json file, where you can configure site-wide settings and styles available to your theme.</p>
				</div>
			</div>

			<div className="mx-auto p-12">
				<div className="max-w-7xl mx-auto flex justify-between gap-20">
					<div className="w-[65%]">
						<div className="flex flex-row">
							<SettingsView isVisible={ true } />
						</div>
						<div className="py-5 text-xl flex items-center sticky bottom-0 bg-[rgba(255,255,255,.8)] backdrop-blur-sm">
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
										{ __( 'Save Your Theme', 'fse-studio' ) }
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="flex-1 text-base">
						<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded">
							<div>
								<h4 className="mb-2 font-medium">Working with theme.json</h4>
								<p className="text-base mb-3">Theme.json is a configuration file for your theme that allows you to control colors, customization options, font sizes, presets, and more. </p>
								<p className="text-base">This interface let's you visually see and change all of the settings and customizations available via theme.json.</p>
							</div>
							<div>
								<h4 className="mb-2 font-medium">Helpful Documentation</h4>
								<ul>
									<li><a className="text-wp-blue" href="https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/">Working with theme.json</a></li>
									<li><a className="text-wp-blue" href="https://developer.wordpress.org/block-editor/how-to-guides/themes/block-theme-overview/">Block Theme Overview</a></li>
									<li><a className="text-wp-blue" href="https://developer.wordpress.org/block-editor/">Block Editor Handbook</a></li>
									<li><a className="text-wp-blue" href="https://wordpress.tv/2022/03/28/nick-diego-builder-basics-exploring-block-layout-alignment-dimensions-and-spac/">Block Builder Basics Video</a></li>
								</ul>
							</div>
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
		if ( setting === 'custom' || setting === 'appearanceTools' ) {
			continue;
		}
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
			name: convertToUpperCase( setting ),
			slug: setting,
		});
	}

	return <div hidden={!isVisible}>
		<div className="flex flex-col gap-14">
			<ul className="w-full inline-flex text-base fses-json-nav">
				{ tabs.map( ( item ) => (
					<li key={ item.name }>
						<button
							className={
								'w-full text-left p-5 font-medium rounded-sm' +
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
						className="block font-medium text-gray-700 sm:col-span-1 fses-label max-w-[500px]"
					>
						<h2>{ convertToUpperCase( propertyName ) }</h2>
						<p className="font-normal text-base">{properties[propertyName].description}</p>
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
			return<button 
				key={'addAnother'}
				onClick={() => {
					console.log(  schemaPosition + '.0', getBlankArrayFromSchema(propertySchema.items) );
					currentTheme.setThemeJsonValue( 'settings', schemaPosition + '.0', getBlankArrayFromSchema(propertySchema.items), null, 'insert' );
				}}
				className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue my-5"
			>
				{ __( 'Add One', 'fse-studio' ) }
			</button>
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
							<div className="relative">
								<RenderProperties
									key={schemaPosition + '.' + arrIndex}
									isVisible={isVisible}
									properties={propertySchema.items.properties}
									schemaPosition={schemaPosition + '.' + arrIndex}
									topLevelSettingName={topLevelSettingName}
								/>
								<button
									key={'delete'}
									className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue my-5"
									onClick={(e) => {
										e.preventDefault();
										if ( window.confirm( __( 'Are you sure you want to delete this item?', 'fse-studio' ) ) ) {
											currentTheme.setThemeJsonValue( 'settings', schemaPosition + '.' + arrIndex );
										}
									}}
								>
									{ __( 'Delete', 'fse-studio' ) }
								</button>
							</div>
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
							console.log(  schemaPosition + '.' + Object.keys(currentValue).length );
							
							currentTheme.setThemeJsonValue( 'settings', schemaPosition + '.' + Object.keys(currentValue).length, getBlankArrayFromSchema(propertySchema.items), null, 'insert' );
						}}
						className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue my-5"
					>
						{ __( 'Add Another', 'fse-studio' ) }
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
