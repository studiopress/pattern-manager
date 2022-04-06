// @ts-check

// WP Dependencies
import { ColorPicker, Popover, CustomGradientPicker } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, layout, file, globe, check } from '@wordpress/icons';

import PatternPreview from '../PatternPreview';
import PatternPicker from '../PatternPicker';
import useStudioContext from '../../hooks/useStudioContext';

import { fsestudio } from '../../';

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
			return null;
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
	const { patterns, currentThemeJsonFile } = useStudioContext();
	const content = themeJsonFile.data.content;
	const [ currentView, setCurrentView ] = useState( 'settings' );

	const views = [
		{
			name: __( 'Settings', 'fse-studio' ),
			slug: 'settings',
			icon: file,
			current: true,
		},
		{
			name: __( 'Styles', 'fse-studio' ),
			slug: 'styles',
			icon: layout,
			current: false,
		},
		{
			name: __( 'Custom Templates', 'fse-studio' ),
			slug: 'custom_templates',
			icon: globe,
			current: false,
		},
		{
			name: __( 'Template Parts', 'fse-studio' ),
			slug: 'template_parts',
			icon: globe,
			current: false,
		},
	];

	function maybeRenderStylesView() {
		if ( currentView !== 'styles' ) {
			return '';
		}
		return <div>
			<h2>{ fsestudio.schemas.themejson.properties.styles.description }</h2>
		</div>
	}

	function maybeRenderCustomTemplatesView() {}

	function maybeRenderTemplatePartsView() {}

	return (
		<>
			<div className="">
				<ul className="flex">
					{ views.map( ( item ) => (
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
				<div className="flex flex-row px-4 sm:px-6 md:px-8 py-8 gap-14">
					<SettingsView isVisible={ currentView === 'settings' } />
					{ maybeRenderStylesView() }
					{ maybeRenderCustomTemplatesView() }
					{ maybeRenderTemplatePartsView() }
				</div>
			</div>
			<div className="p-5 text-xl border-t border-gray-200 px-4 sm:px-6 md:px-8 flex justify-between items-center">
				<div className="flex items-center">
					{ themeJsonFile.hasSaved ?
						(
							<span className="text-sm text-green-600 flex flex-row items-center mr-6">
								<Icon
									className="fill-current"
									icon={ check }
									size={ 26 }
								/>{ ' ' }
								{ __( 'Saved to disk', 'fse-studio' ) }
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
						{ __( 'Save Theme and Theme Configuration File', 'fse-studio' ) }
					</button>
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
						schemaPosition={propertyName }
						topLevelSettingName={setting}
					/>
				)
			} else {
				rendered.push(
					<RenderProperties
						key={propertyName}
						isVisible={ currentView === setting }
						properties={settings[setting].properties}
						schemaPosition={setting}
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
			<ul className="w-72">
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
			<div className="divide-y divide-gray-200">{ rendered }</div>
		</div>
	</div>
}

function RenderProperties( { isVisible, properties, schemaPosition, topLevelSettingName } ) {
	const renderedProperties = [];
	
	for( const propertyName in properties ) {
		
		
			console.log( 'Schema:', schemaPosition + ',' + propertyName );
		
	
		renderedProperties.push(
			<div key={propertyName} hidden={!isVisible}>
				<div className="sm:grid sm:grid-cols-4 sm:gap-4 py-6 sm:items-top">
					<label
						htmlFor={propertyName}
						className="block text-sm font-medium text-gray-700 sm:col-span-1"
					>
						<h2>{ propertyName }</h2>
						<p>{properties[propertyName].description}</p>
					</label>
					<div className="mt-1 sm:mt-0 sm:col-span-3 divide-y">
						<RenderProperty
							isVisible={isVisible}
							propertySchema={properties[propertyName]}
							propertyName={propertyName}
							schemaPosition={schemaPosition + ',' + propertyName }
							topLevelSettingName={topLevelSettingName}
						/>
					</div>
				</div>
			</div>
		)
	}
	
	return renderedProperties;
}


function RenderProperty( {isVisible, propertySchema, propertyName, schemaPosition, topLevelSettingName } ) {
	const { currentThemeJsonFile } = useStudioContext();
	const currentValue = getCurrentValue( currentThemeJsonFile.data, schemaPosition, propertyName, propertySchema.type );

	function updateCurrentValue( data, selectorString, value ) {
		const modifiedData = { ...data };
		
		// Split the selector string at commas
		const keys = selectorString.split(',');
	
		const numberOfKeys = keys.length;
	
		if ( numberOfKeys === 1 ) {
			const keyOne = [keys[0]];
			if ( value ) {
				modifiedData.content['settings'][keyOne] = value;
			} else {
				delete modifiedData.content['settings'][keyOne];
			}
		}
		if ( numberOfKeys === 2 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];

			// If keyone already exists, and keytwo already exists, just change the value.
			if( modifiedData.content['settings'][keyOne] && modifiedData.content['settings'][keyOne][keyTwo] ) {
				if ( value ) {
					modifiedData.content['settings'][keyOne][keyTwo] = value;
				} else {
					delete modifiedData.content['settings'][keyOne][keyTwo];
					// If this is the last value in keyOne, delete the keyOne as well.
					if ( Object.entries(modifiedData.content['settings'][keyOne]).length === 0 ) {
						delete modifiedData.content['settings'][keyOne];
					}
				}
			} else {
				if ( value ) {
					// If keyone does not exist yet, set it first, then set keytwo after.
					if ( ! modifiedData.content['settings'][keyOne] ) {
						modifiedData.content['settings'][keyOne] = {};
					}
					modifiedData.content['settings'][keyOne][keyTwo] = value;
					if ( propertyName === 'radius' ) {
						console.log( selectorString, keys, numberOfKeys, modifiedData.content['settings'][keyOne][keyTwo], value );
					}
				}
			}
		}
		if ( numberOfKeys === 3 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];

			// If keys aready exists, just change the value.
			if (
				modifiedData.content['settings'][keyOne] &&
				modifiedData.content['settings'][keyOne][keyTwo] &&
				modifiedData.content['settings'][keyOne][keyThree]
			) {
				if ( value ) {
					modifiedData.content['settings'][keyOne][keyTwo][keyThree] = value;
				} else {
					delete modifiedData.content['settings'][keyOne][keyTwo][keyThree];
					// If this is the last value in keyTwo, delete the keyTwo as well.
					if ( Object.entries(modifiedData.content['settings'][keyOne][keyTwo]).length === 0 ) {
						delete modifiedData.content['settings'][keyOne][keyTwo];
					}
					// If this is the last value in keyOne, delete the keyOne as well.
					if ( Object.entries(modifiedData.content['settings'][keyOne]).length === 0 ) {
						delete modifiedData.content['settings'][keyOne];
					}
				}
			} else {
				if ( value ) {
					// If keyone does not exist yet, set it first, then set keytwo after.
					if ( ! modifiedData.content['settings'][keyOne] ) {
						modifiedData.content['settings'][keyOne] = {};
					}
					if ( ! modifiedData.content['settings'][keyOne][keyTwo] ) {
						modifiedData.content['settings'][keyOne][keyTwo] = {};
					}
					modifiedData.content['settings'][keyOne][keyTwo][keyThree] = value;
				}
			}
		}
		if ( numberOfKeys === 4 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];
			const keyFour = [keys[3]];

			// If keys aready exists, just change the value.
			if (
				modifiedData.content['settings'][keyOne] &&
				modifiedData.content['settings'][keyOne][keyTwo] &&
				modifiedData.content['settings'][keyOne][keyThree] &&
				modifiedData.content['settings'][keyOne][keyFour]
			) {
				if ( value ) {
					modifiedData.content['settings'][keyOne][keyTwo][keyThree][keyFour] = value;
				} else {
					delete modifiedData.content['settings'][keyOne][keyTwo][keyThree][keyFour];
					// If this is the last value in keyThree, delete the keyThree as well.
					if ( Object.entries(modifiedData.content['settings'][keyOne][keyTwo][keyThree]).length === 0 ) {
						delete modifiedData.content['settings'][keyOne][keyTwo][keyThree];
					}
					// If this is the last value in keyTwo, delete the keyTwo as well.
					if ( Object.entries(modifiedData.content['settings'][keyOne][keyTwo]).length === 0 ) {
						delete modifiedData.content['settings'][keyOne][keyTwo];
					}
					// If this is the last value in keyOne, delete the keyOne as well.
					if ( Object.entries(modifiedData.content['settings'][keyOne]).length === 0 ) {
						delete modifiedData.content['settings'][keyOne];
					}
				}
			} else {
				if ( value ) {
					// If keyone does not exist yet, set it first, then set keytwo after.
					if ( ! modifiedData.content['settings'][keyOne] ) {
						modifiedData.content['settings'][keyOne] = {};
					}
					if ( ! modifiedData.content['settings'][keyOne][keyTwo] ) {
						modifiedData.content['settings'][keyOne][keyTwo] = {};
					}
					if ( ! modifiedData.content['settings'][keyOne][keyTwo][keyThree] ) {
						modifiedData.content['settings'][keyOne][keyTwo][keyThree] = {};
					}
					modifiedData.content['settings'][keyOne][keyTwo][keyThree][keyFour] = value;
				}
			}
		}

		currentThemeJsonFile.set( modifiedData );

	}
	
	function getCurrentValue( data, selectorString, propertyName, type ) {
		// Split the selector string at commas
		const keys = selectorString.split(',');
	
		const numberOfKeys = keys.length;

		if ( numberOfKeys === 1 ) {
			const keyOne = [keys[0]];
			if (data?.content?.settings.hasOwnProperty(keyOne)) {
				return data.content.settings[keyOne];
			}
		}
		if ( numberOfKeys === 2 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];

			if (data?.content?.settings.hasOwnProperty(keyOne)) {
				if ( data?.content?.settings[keyOne].hasOwnProperty(keyTwo) ) {
					return data?.content?.settings[keyOne][keyTwo]
				}
			}
		}
		if ( numberOfKeys === 3 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];

			if (data?.content?.settings.hasOwnProperty(keyOne)) {
				if ( data?.content?.settings[keyOne].hasOwnProperty(keyTwo) ) {
					if ( data?.content?.settings[keyOne][keyTwo].hasOwnProperty(keyThree) ) {
						return data?.content?.settings[keyOne][keyTwo][keyThree]
					}
				}
			}
		}
		if ( numberOfKeys === 4 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];
			const keyFour = [keys[3]];

			if (data?.content?.settings.hasOwnProperty(keyOne)) {
				if ( data?.content?.settings[keyOne].hasOwnProperty(keyTwo) ) {
					if ( data?.content?.settings[keyOne][keyTwo].hasOwnProperty(keyThree) ) {
						if ( data?.content?.settings[keyOne][keyTwo][keyThree].hasOwnProperty(keyFour) ) {
							return data?.content?.settings[keyOne][keyTwo][keyThree][keyFour]
						}
					}
				}
			}
		}
		
		if ( type === 'boolean' ) {
			return false;
		}
		
		return null;
	}

	if ( propertySchema.type === 'boolean' || propertySchema.oneOf ) {
		return <input
			
			type="checkbox"
			id={propertyName}
			name={propertyName}
			checked={ currentValue }
			onChange={( event ) => {
				updateCurrentValue( currentThemeJsonFile.data, schemaPosition, currentValue ? false : true, propertySchema.type );
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
				updateCurrentValue( currentThemeJsonFile.data, schemaPosition, newValue );
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

		const rendered = [];

		// If this setting does not exist in the current theme.json file.
		if ( ! currentValue ) {
			return 'Nothing yet!';
		} else {
			// Loop through each saved item in the theme.json file for this array.
			for ( const value in currentValue ) {
				// If these array items are objects (an array of objects)
				if ( propertySchema.items.type === 'object' ) {
					// Render the properties in the schema, using the current loop's values for the properties
					rendered.push(
						<RenderProperties
							key={value}
							isVisible={isVisible}
							properties={propertySchema.items.properties}
							schemaPosition={schemaPosition + ',' + value}
							topLevelSettingName={topLevelSettingName}
						/>
					)
				} else {
					rendered.push(
						<div key={value} hidden={!isVisible}>
							<div className="sm:grid sm:grid-cols-4 sm:gap-4 py-6 sm:items-top">
								<div className="mt-1 sm:mt-0 sm:col-span-3 divide-y">
									<RenderProperty
										isVisible={isVisible}
										propertySchema={propertySchema.items}
										propertyName={propertyName}
										schemaPosition={schemaPosition + ',' + value }
										topLevelSettingName={topLevelSettingName}
									/>
								</div>
							</div>
						</div>
					)
				}
			}
		}
		return rendered;
	}
	
	return null;
	
}

function ValueSetter({name, value, onChange}) {
	
	if( 'gradient' === name ) {
		return <div>
			<CustomGradientPicker
				value={ value }
				onChange={ onChange }
			/>
		</div>
	}

	if( 'color' === name || 'colors' === name ) {
		return <div>
			<ColorPicker
				color={ value }
				// @ts-ignore The declaration file is wrong.
				onChange={ onChange }
				enableAlpha
				defaultValue="#000"
			/>
		</div>
	}
	
	return <input name={name} type="text" value={value} onChange={(event) => {
		onChange(event.target.value);
	}} />
}

function InputField( { name, description, value, onChange = () => {} } ) {
	return <div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
		<label
			htmlFor={name}
			className="block text-sm font-medium text-gray-700 sm:col-span-1"
		>
			<p>{ name }</p>
			<p>{ description }</p>
			
		</label>
		<div className="mt-1 sm:mt-0 sm:col-span-2">
			<input
				className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
				type="text"
				id={name}
				value={
					value
				}
				// @ts-ignore The declaration file is wrong.
				onChange={ onChange }
			/>
		</div>
	</div>
}

function FseStudioColorPalette( { themeJsonFile, colors } ) {
	function renderColorOptions() {
		return colors.map( ( color, index ) => (
			<FseStudioColorPalettePicker
				key={ color.slug }
				themeJsonFile={ themeJsonFile }
				color={ color }
				index={ index }
			/>
		) );
	}

	return <div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
		<label
			htmlFor={ 'colorpalette' }
			className="block text-sm font-medium text-gray-700 sm:col-span-1"
		>
			{ __( 'Color Palette', 'fse-studio' ) }
		</label>
		<div className="mt-1 sm:mt-0 sm:col-span-2">
			<div className="grid gap-5">{ renderColorOptions() }</div>
		</div>
	</div>
}

function FseStudioColorPalettePicker( { themeJsonFile, color, index } ) {
	const [ popoverIsVisible, setPopoverIsVisible ] = useState( false );

	function maybeRenderPickerPopover() {
		if ( popoverIsVisible ) {
			return (
				<Popover
					onClose={ () => {
						setPopoverIsVisible( false );
					} }
				>
					<div className="p-2">
						<ColorPicker
							color={ color.color }
							// @ts-ignore The declaration file is wrong.
							onChange={ ( colorValue ) => {
								const modifiedData = { ...themeJsonFile.data };
								modifiedData.content.settings.color.palette[
									index
								] = {
									...modifiedData.content.settings.color
										.palette[ index ],
									color: colorValue,
								};

								themeJsonFile.set( modifiedData );
							} }
							enableAlpha
							defaultValue="#000"
						/>
					</div>
				</Popover>
			);
		}
	}

	return (
		<>
			<div>
				<label
					className="flex gap-1"
					onClick={ () => {
						setPopoverIsVisible( true );
					} }
				>
					<div
						style={ {
							width: '20px',
							height: '20px',
							backgroundColor: color.color,
						} }
						onClick={ () => {
							setPopoverIsVisible( true );
						} }
					>
						{ maybeRenderPickerPopover() }
					</div>
					<div>{ color.name }</div>
				</label>
			</div>
		</>
	);
}
