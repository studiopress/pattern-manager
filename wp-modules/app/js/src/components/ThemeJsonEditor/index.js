// @ts-check

// WP Dependencies
import { ColorPicker, Popover } from '@wordpress/components';
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

	function renderPatternPreviews() {
		const rendered = [];

		for ( const blockPattern in patterns.patterns ) {
			rendered.push(
				<div className="w-full">
					<PatternPreview
						key={ blockPattern }
						blockPatternData={ patterns.patterns[ blockPattern ] }
						themeJsonData={ currentThemeJsonFile.data }
						scale={ 0.15 }
					/>
				</div>
			);
		}

		return rendered;
	}

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

function SettingsView({ isVisible }) {
	const { currentThemeJsonFile } = useStudioContext();
	const [ currentView, setCurrentView ] = useState( 'color' );
	
	function renderSetting( schemaSettingData, settingName, settingData ) {
	
		return <div hidden={ currentView !== settingName }>
			{ renderSettingInner( schemaSettingData, settingName, settingData ) }
		</div>
	
	}
	function renderSettingInner( schemaSettingData, settingName, settingData ) {
		if ( settingName === 'color' ) {
			console.log(schemaSettingData, settingName, settingData );
			for ( const colorSetting in settingData ) {
				if ( colorSetting === 'palette' ) {
					return (
						<FseStudioColorPalette
							key={ colorSetting }
							themeJsonFile={ currentThemeJsonFile }
							colors={
								settingData[ colorSetting ]
							}
						/>
					)
				}
			}
		}
		if ( settingName === 'layout' ) {
				return (
					<>
					<InputField
						key={ 'contentSize' }
						name={ __( 'Width of "content" content', 'fse-studio' ) }
						value={
							currentThemeJsonFile?.data?.content?.settings.layout['contentSize']
								? currentThemeJsonFile?.data?.content?.settings.layout['contentSize']
								: ''
						}
						// @ts-ignore The declaration file is wrong.
						onChange={ ( event ) => {
							const modifiedData = { ...currentThemeJsonFile.data };
							modifiedData.content.settings.layout['contentSize'] = event.target.value;
							currentThemeJsonFile.set( modifiedData );
						} }
					/>
					<InputField
						key={ 'wideSize' }
						name={ __( 'Width of "wide" content', 'fse-studio' ) }
						value={
							currentThemeJsonFile?.data?.content?.settings.layout['wideSize']
								? currentThemeJsonFile?.data?.content?.settings.layout['wideSize']
								: ''
						}
						// @ts-ignore The declaration file is wrong.
						onChange={ ( event ) => {
							const modifiedData = { ...currentThemeJsonFile.data };
							modifiedData.content.settings.layout['wideSize'] = event.target.value;
							currentThemeJsonFile.set( modifiedData );
						} }
					/>
					</>
				)
		}
		
		return (
			<div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
				<label
					htmlFor={settingName}
					className="block text-sm font-medium text-gray-700 sm:col-span-1"
				>
					{ settingName }
				</label>
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						className="block w-full !shadow-sm !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !border-gray-300 !rounded-md !h-10"
						type="text"
						id={settingName}
						value={
							settingName
						}
						// @ts-ignore The declaration file is wrong.
						onChange={ () => {
						
						}}
					/>
				</div>
			</div>
		)
	}
	
	// Use the themeJson schema and currentThemeJsonFile to generate the settings and values.
	const rendered = [];
	const settingsTabs = [];
	const settingsPropertiesComplete = fsestudio.schemas.themejson.definitions.settingsPropertiesComplete;
	for ( const setting in fsestudio.schemas.themejson.definitions ) {
		if ( setting === 'settingsPropertiesComplete' || ! setting.startsWith( 'settingsProperties' ) ) { continue }
		const settingData = fsestudio.schemas.themejson.definitions[setting];
		// If this is not a "setting" that is defined inside settingsPropertiesComplete, skip it.
		for ( const propertyName in settingData.properties ) {
			if ( ! ( propertyName in settingsPropertiesComplete.allOf[1].properties ) ) { continue }
			rendered.push( renderSetting( settingData.properties[propertyName], propertyName, currentThemeJsonFile.data.content.settings[propertyName] ) );
			settingsTabs.push({
				name: propertyName,
				slug: propertyName,
			});
		}
	}

	return <div hidden={!isVisible}>
		<div className="flex flex-row gap-14">
			<ul className="w-72">
				{ settingsTabs.map( ( item ) => (
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
			<div>
				<h2>{ fsestudio.schemas.themejson.properties.settings.description }</h2>
				<div className="divide-y divide-gray-200">{ rendered }</div>
			</div>
		</div>
	</div>
}

function InputField( { name, value, onChange = () => {} } ) {
	return <div className="sm:grid sm:grid-cols-3 sm:gap-4 py-6 sm:items-center">
		<label
			htmlFor={name}
			className="block text-sm font-medium text-gray-700 sm:col-span-1"
		>
			{ name }
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
