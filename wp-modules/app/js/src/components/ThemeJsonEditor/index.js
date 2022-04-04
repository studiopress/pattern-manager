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
					<SettingsView isVisible={ currentView === 'settings' } mode="settings" />
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

function SettingsView({ isVisible, mode='settings' }) {
	const { currentThemeJsonFile } = useStudioContext();
	const [ currentView, setCurrentView ] = useState( 'color' );
	
	// Use the themeJson schema and currentThemeJsonFile to generate the settings and values.
	const rendered = [];
	const tabs = [];
	let propertiesCompleteName = 'settings';
	if ( mode === 'settings' ) {
		propertiesCompleteName = 'settingsPropertiesComplete' ;
	}
	
	const propertiesComplete = fsestudio.schemas.themejson.definitions[propertiesCompleteName];
	
	for ( const setting in fsestudio.schemas.themejson.definitions ) {
		// Skip schemas that are not settings.
		if ( setting === propertiesCompleteName || ! setting.startsWith( mode + 'Properties' ) ) { continue }
		
		// Get the data for this setting from the schema.
		const settingData = fsestudio.schemas.themejson.definitions[setting];
	
		// Loop through each property in each setting in the schema.
		for ( const propertyName in settingData.properties ) {
			// If this is not a "setting" that is defined inside propertiesComplete, skip it.
			if ( ! ( propertyName in propertiesComplete.allOf[1].properties ) ) { continue }
			
			// FSE Studio does not yet handle the "blocks"
			if ( ! ( propertyName in propertiesComplete.allOf[1].properties ) ) { continue }
			
			console.log( propertyName );
			rendered.push(
				<Setting
					isVisible={currentView === propertyName}
					schemaSettingData={settingData.properties[propertyName]}
					settingName={propertyName}
					settingData={currentThemeJsonFile.data.content[mode][propertyName]}
					topLevelSettingName={propertyName}
				/>
			);

			tabs.push({
				name: propertyName,
				slug: propertyName,
			});
		}
	}

	return <div hidden={!isVisible}>
		<p>{ fsestudio.schemas.themejson.properties[mode].description }</p>
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

function Setting( { isVisible, schemaSettingData, settingName, settingData, topLevelSettingName } ) {
	const renderedProperties = [];
	
	if ( schemaSettingData.type === 'object' ) {
		for( const propertyName in schemaSettingData.properties ) {
			renderedProperties.push(
				<div key={propertyName} className="sm:grid sm:grid-cols-4 sm:gap-4 py-6 sm:items-top">
				<label
					htmlFor={propertyName}
					className="block text-sm font-medium text-gray-700 sm:col-span-1"
				>
					<h2>{ propertyName }</h2>
					<p>{schemaSettingData.properties[propertyName].description}</p>
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-3 divide-y">
					<SettingProperty
						propertySchema={schemaSettingData.properties[propertyName]}
						propertyName={propertyName}
						settingValue={settingData?.hasOwnProperty( propertyName ) ? settingData[propertyName] : null}
						topLevelSettingName={topLevelSettingName}
						mode="settings"
					/>
				</div>
			</div>
			)
		}
	} else {
		renderedProperties.push(
			<div key={settingName} className="sm:grid sm:grid-cols-4 sm:gap-4 py-6 sm:items-top">
				<label
					htmlFor={settingName}
					className="block text-sm font-medium text-gray-700 sm:col-span-1"
				>
					<h2>{ settingName }</h2>
					<p>{schemaSettingData.description}</p>
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-3 divide-y">
					<SettingProperty
						propertySchema={schemaSettingData}
						propertyName={settingName}
						settingValue={settingData ? settingData : null}
						topLevelSettingName={topLevelSettingName}
						mode="settings"
					/>
				</div>
			</div>
		)
	}

	return <div key={settingName} hidden={ ! isVisible } className="divide-y divide-gray-200">
		<p>{schemaSettingData.description}</p>
		{ renderedProperties }
	</div>

}

function SettingProperty( {propertySchema, propertyName, settingValue, topLevelSettingName, mode = "settings" } ) {
	const { currentThemeJsonFile } = useStudioContext();

	if ( propertySchema.type === 'boolean' || propertySchema.oneOf ) {
		return <input
			
			type="checkbox"
			id={propertyName}
			name={propertyName}
			checked={settingValue ? true : false}
			// @ts-ignore The declaration file is wrong.
			onChange={( event ) => {
				const modifiedData = { ...currentThemeJsonFile.data };
				if ( propertyName ) {
					console.log( modifiedData.content[mode] );
					if( modifiedData.content[mode][topLevelSettingName] && modifiedData.content[mode][topLevelSettingName][propertyName] ) {
						modifiedData.content[mode][topLevelSettingName][propertyName] = modifiedData.content[mode][topLevelSettingName][propertyName] ? false : true;
					} else {
						if ( ! modifiedData.content[mode][topLevelSettingName] ) {
							modifiedData.content[mode][topLevelSettingName] = {};
						}
						modifiedData.content[mode][topLevelSettingName][propertyName] = true;
					}
				} else {
					if ( modifiedData.content[mode][topLevelSettingName] ) {
						modifiedData.content[mode][topLevelSettingName] = modifiedData.content[mode][topLevelSettingName] ? false : true;
					} else {
						modifiedData.content[mode][topLevelSettingName] = true;
					}
				}
				currentThemeJsonFile.set( modifiedData );
			}}
		/>
	}
	if (
		propertySchema.type === 'string' || propertySchema.type === 'number'
	) {
		
		return <ValueSetter
			name={ propertyName }
			value={
				settingValue
			}
			onChange={ (newValue) => {
				const modifiedData = { ...currentThemeJsonFile.data };
				if ( propertyName ) {
					modifiedData.content[mode][topLevelSettingName][propertyName] = newValue;
				} else {
					modifiedData.content[mode][topLevelSettingName] = newValue;
				}
				currentThemeJsonFile.set( modifiedData );
			}}
		/>
	}
	if ( propertySchema.type === 'array' ) {
		
		const rendered = [];
		
		// If this setting does not exist in the current theme.json file.
		if ( ! currentThemeJsonFile.data.content.settings[topLevelSettingName][propertyName] ) {
			rendered.push(
				<div className="flex sm:gap-4  py-6">
					{ (() => {
						const renderedValue = [];
						// Loop through each schema property in this property.
						for( const theSchemaName in propertySchema.items.properties ) {
							if ( propertySchema.items.properties[theSchemaName].type === 'string' ) {
								renderedValue.push(
									<button
										onClick={ () => {
											const modifiedData = { ...currentThemeJsonFile.data };
											if ( propertyName ) {
												modifiedData.content[mode][topLevelSettingName][propertyName] = [{}];
												modifiedData.content[mode][topLevelSettingName][propertyName][0][theSchemaName] = '';
											} else {
												modifiedData.content[mode][topLevelSettingName][0][theSchemaName] = '';
											}
											currentThemeJsonFile.set( modifiedData );
										}}
									>
										Add one of these
									</button>
								);
							}
							// This handles cases like "duotone", in which an array of options contains it's own array of options.
							if ( propertySchema.items.properties[theSchemaName].type === 'array' ) {
								//console.log( propertySchema.items.properties[theSchemaName] );
								
								console.log( propertySchema.items.properties[theSchemaName].items );
								
								renderedValue.push(
									<Setting
										isVisible={true}
										schemaSettingData={propertySchema.items.properties[theSchemaName].items}
										settingName={theSchemaName}
										settingData={null}
										topLevelSettingName={topLevelSettingName}
										mode="settings"
									/>
								);
								
								renderedValue.push( 'Add Anther suboption!' );
								
							}
						}
						return renderedValue;
					})() }
					Add Anther!
				</div>
			)
		} else {
			// Loop through each saved property in the theme.json file.
			for( const objectNumber in currentThemeJsonFile.data.content.settings[topLevelSettingName][propertyName] ) {
				if ( propertySchema.items.type === 'object' ) {
					rendered.push(
						<div className="flex sm:gap-4  py-6">
						{ (() => {
							const renderedValue = [];
							const previouslySavedValue = currentThemeJsonFile.data.content.settings[topLevelSettingName][propertyName][objectNumber];
							// Loop through each schema property in this property.
							for( const theSchemaName in propertySchema.items.properties ) {
								if ( propertySchema.items.properties[theSchemaName].type === 'string' ) {
									renderedValue.push(
										<div>
											<h2>{theSchemaName}</h2>
											<p>{propertySchema.items.properties[theSchemaName].description}</p>
											<ValueSetter
												name={ theSchemaName }
												value={ previouslySavedValue[theSchemaName] }
												onChange={ (newValue) => {
													const modifiedData = { ...currentThemeJsonFile.data };
													if ( propertyName ) {
														modifiedData.content[mode][topLevelSettingName][propertyName][objectNumber][theSchemaName] = newValue;
													} else {
														modifiedData.content[mode][topLevelSettingName][objectNumber][theSchemaName] = newValue;
													}
													currentThemeJsonFile.set( modifiedData );
												}}
											/>
										</div>
									);
								}
								// This handles cases like "duotone", in which an array of options contains it's own array of options.
								if ( propertySchema.items.properties[theSchemaName].type === 'array' ) {
									renderedValue.push(
										<Setting
											isVisible={true}
											schemaSettingData={propertySchema.items.properties[theSchemaName].items}
											settingName={theSchemaName}
											settingData={previouslySavedValue[theSchemaName]}
											topLevelSettingName={topLevelSettingName}
											mode="settings"
										/>
									);
									renderedValue.push( 'Add Anther suboption!' );
								}
							}
							return renderedValue;
						})() }
						Add Anther!
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
	
	return <input valueSetter={name} type="text" value={value} onChange={(event) => {
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
